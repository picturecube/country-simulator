import p5 from 'p5';
import MapPixel from './MapPixel.ts'
class SimMap {
    mapData: ( string | { color: string } )[][];
    size = 100;
    pixels: MapPixel[][] = [[], [], [], [], [], [], [], [], []];
    wakanda = {
        resources: 10,
        color: '',
        available: [] as number[][]
    };
    panem = {
        resources: 10,
        color: '',
        available: []
    };

    constructor(w: string, l: string, wakanda: string, panem: string) {
        this.mapData = [[w,       w, w, w, l, w, w, w,     w],
                        [w,       w, w, l, l, l, w, w,     w],
                        [w,       w, l, l, l, l, l, w,     w],
                        [w,       l, l, l, l, l, l, l,     w],
                        [this.wakanda, l, l, l, l, l, l, l, this.panem],
                        [w,       l, l, l, l, l, l, l,     w],
                        [w,       w, l, l, l, l, l, w,     w],
                        [w,       w, w, l, l, l, w, w,     w],
                        [w,       w, w, w, l, w, w, w,     w]];
        this.wakanda.color = wakanda
        this.panem.color = panem
    };

    createMap(p: p5) {
        console.log('creating map')
        console.log(this.mapData)
        // create a pixel object for each pixel
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                this.pixels[row].push(new MapPixel(this.mapData[row][col], row, col, this.size));
                console.log(`pixel created at ${row} ${col}`)
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

    update(p: p5) {
        this.findAvailable(this.wakanda, p);
        this.findAvailable(this.panem, p);
        // each tick, each country will only use about a third of its resources, rounded down, and won't "mobilize" more resources than available land
        let wakandaUsableResources: number = p.constrain(p.floor(this.wakanda.resources / 3), 0, this.wakanda.available.length);
        // conquer a random pixel of available land (later i will add strategic assets)
        for (let rsrc = 0; rsrc < wakandaUsableResources; rsrc++) {
            let conquerablePixel = p.random(this.wakanda.available);
            this.pixels[conquerablePixel[0]][conquerablePixel[1]].type = this.wakanda.color;
        };
        // add 4/3 of the resources it just used because that makes sense (when i add more factors like economy this factor will change)
        this.wakanda.resources += p.floor(4 * wakandaUsableResources / 3)
        this.wakanda.resources -= wakandaUsableResources
        // repeat for panem
        let panemUsableResources: number = p.constrain(p.floor(this.panem.resources / 3), 0, this.panem.available.length);
        for (let rsrc = 0; rsrc < panemUsableResources; rsrc++) {
            let conquerablePixel = p.random(this.panem.available);
            this.pixels[conquerablePixel[0]][conquerablePixel[1]].type = this.panem.color;
        };
        this.panem.resources += p.floor(4 * panemUsableResources / 3)
        this.panem.resources -= panemUsableResources
        
    };
};

export default SimMap;