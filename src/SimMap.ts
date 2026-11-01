import p5 from 'p5';
import MapPixel from './MapPixel.ts'
class SimMap {
    // the map is a 9x9 grid of pixels, each pixel is 100x100 px
    // the data is either the color or a country object with a color property
    mapData: ( string | { color: string } )[][];
    size = 100;
    // the pixel objects are stored in a separate array because they are for displaying the map only
    pixels: MapPixel[][] = [[], [], [], [], [], [], [], [], []];
    // Resources: each pixel conquered consumes 1 resource, 
    // and each tick each country will use 1/3 of the resources it has, rounded down, 
    // and will gain 4/3 of the resources it used, rounded down
    // Available: an array of all the pixels that are adjacent to a country's pixels and are free land,
    // so that the country can conquer them in the next tick
    cindercrest = {
        resources: 10,
        color: '',
        available: [] as number[][]
    };
    nullEmpire = {
        resources: 10,
        color: '',
        available: [] as number [][]
    };
    // this array has the feature, if any, of each pixel
    // A feature includes anything of strategic value, like a city or a farm
    featureMatrix: string[][] = [['', '', '', '', '', '', '', '', ''], 
                                 ['', '', '', '', '', '', '', '', ''], 
                                 ['', '', '', '', '', '', '', '', ''], 
                                 ['', '', '', '', '', '', '', '', ''], 
                                 ['', '', '', '', '', '', '', '', ''], 
                                 ['', '', '', '', '', '', '', '', ''], 
                                 ['', '', '', '', '', '', '', '', ''], 
                                 ['', '', '', '', '', '', '', '', ''], 
                                 ['', '', '', '', '', '', '', '', '']];
    // this object maps the feature to the material symbol that will be drawn on the map
    featureMap: Record < string, string > = {
        city: 'domain',
        '': ''
    };

    constructor(w: string, l: string, cindercrest: string, nullEmpire: string) {
        this.mapData = [[w,       w, w, w, l, w, w, w,     w],
                        [w,       w, w, l, l, l, w, w,     w],
                        [w,       w, l, l, l, l, l, w,     w],
                        [w,       l, l, l, l, l, l, l,     w],
                        [this.cindercrest, l, l, l, l, l, l, l, this.nullEmpire],
                        [w,       l, l, l, l, l, l, l,     w],
                        [w,       w, l, l, l, l, l, w,     w],
                        [w,       w, w, l, l, l, w, w,     w],
                        [w,       w, w, w, l, w, w, w,     w]];
        this.cindercrest.color = cindercrest
        this.nullEmpire.color = nullEmpire
    };

    createMap(p: p5) {
        console.log('creating map')
        console.log(this.mapData)
        // create a pixel object for each pixel
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                let feature = '';
                if (typeof(this.mapData[row][col]) === 'object') {
                    feature = 'city';
                };
                this.pixels[row].push(new MapPixel(this.mapData[row][col], row, col, this.size, feature, this));
                console.log(`pixel created at ${row} ${col}`);
            };
        };
    };

    findAvailable(country: { color: string, available: number[][] }, p: p5) {
        // looks in 4 directions from each pixel for free land and adds that free land to the country's available array
        country.available = []
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                if (this.pixels[row][col].type === country.color) {
                    if (this.pixels[p.constrain(row + 1, 0, 8)][col].type === '255, 255, 255') {
                        country.available.push([row + 1, col]);
                    };
                    if (this.pixels[p.constrain(row - 1, 0, 8)][col].type === '255, 255, 255') {
                        country.available.push([row - 1, col]);
                    };
                    if (this.pixels[row][p.constrain(col + 1, 0, 8)].type === '255, 255, 255') {
                        country.available.push([row, col + 1]);
                    };
                    if (this.pixels[row][p.constrain(col - 1, 0, 8)].type === '255, 255, 255') {
                        country.available.push([row, col - 1]);
                    };
                };
            };
        };
    };

    update(p: p5, materialSymbolsRounded: p5.Font) {
        this.findAvailable(this.cindercrest, p);
        this.findAvailable(this.nullEmpire, p);
        // each tick, each country will only use about a third of its resources, rounded down, and won't "mobilize" more resources than available land
        let cindercrestUsableResources: number = p.constrain(p.floor(this.cindercrest.resources / 3), 0, this.cindercrest.available.length);
        // conquer a random pixel of available land (later i will add strategic assets)
        for (let rsrc = 0; rsrc < cindercrestUsableResources; rsrc++) {
            let conquerablePixel = p.random(this.cindercrest.available);
            this.pixels[conquerablePixel[0]][conquerablePixel[1]].type = this.cindercrest.color;
        };
        // add 4/3 of the resources it just used because that makes sense (when i add more factors like economy this factor will change)
        this.cindercrest.resources -= cindercrestUsableResources;
        this.cindercrest.resources += p.floor(4 * cindercrestUsableResources / 3);

        // repeat for null
        let nullEmpireUsableResources: number = p.constrain(p.floor(this.nullEmpire.resources / 3), 0, this.nullEmpire.available.length);
        for (let rsrc = 0; rsrc < nullEmpireUsableResources; rsrc++) {
            let conquerablePixel = p.random(this.nullEmpire.available);
            this.pixels[conquerablePixel[0]][conquerablePixel[1]].type = this.nullEmpire.color;
        };
        this.nullEmpire.resources -= nullEmpireUsableResources;
        this.nullEmpire.resources += p.floor(4 * nullEmpireUsableResources / 3);
        
        // add symbol for each feature
        console.log(this.featureMatrix);
        p.textFont(materialSymbolsRounded);
        p.fill(0);
        for (let row = 0; row < this.featureMatrix.length; row++) {
            for (let col = 0; col < this.featureMatrix[row].length; col++) {
                p.text(this.featureMap[this.featureMatrix[row][col]], row * this.size, col * this.size);
                console.log(`added symbol ${this.featureMap[this.featureMatrix[row][col]]} at ${row} ${col}`);
            };
        };
    };
};

export default SimMap;