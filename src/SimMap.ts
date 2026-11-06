/* SETUP STUFF */

import p5 from 'p5';
import MapPixel from './MapPixel.ts'
import Country from './Country.ts';
import constrain from "./constrain.ts";

class SimMap {
    // The map is a 9x9 grid of pixels and each pixel is 100x100 px
    // The data is either the color or a country object with a color property
    mapData: ( string | { color: string } )[][];

    /**/

    size = 20;
    // The pixel objects are stored in a separate array because they are for displaying the map only
    pixels: MapPixel[][] = Array.from({ length: 49 }, () => Array(49).fill(null));
    // This array has the feature, if any, of each pixel.
    // A feature includes anything of strategic value, like a city or a farm
    featureMatrix: string[][] = Array.from({ length: 49 }, () => Array(49).fill(''));
    // This object maps the feature to the material symbol that will be drawn on the map
    featureMap: Record<string, p5.Image> = {};
    async fillFeatureMap(p: p5) {
        this.featureMap.city = await p.loadImage('https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/symbols/web/domain/materialsymbolsrounded/domain_48px.svg');
        this.featureMap.arable = await p.loadImage('https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/symbols/web/agriculture/materialsymbolsrounded/agriculture_48px.svg');
        this.featureMap.capital = await p.loadImage('https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/symbols/web/stars/materialsymbolsrounded/stars_48px.svg');
        this.featureMap.suburb = await p.loadImage('https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/symbols/web/location_city/materialsymbolsrounded/location_city_48px.svg');
    };

    constructor(w: string, l: string, mapData: (string | Country)[][] , p: p5) {
        
        console.log('pixels array created: ', this.pixels);
        this.mapData = mapData;

        this.fillFeatureMap(p);
        console.log('feature matrix: ', this.featureMatrix);
    };

    createMap(p: p5) {
        console.log('creating map')
        console.log(this.mapData)
        // Create a pixel object for each pixel
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                let feature = this.featureMatrix[row][col];
                if (typeof(this.mapData[row][col]) === 'object') {
                    feature = 'capital';
                };
                this.pixels[row][col] = new MapPixel(this.mapData[row][col], row, col, this.size, feature, this);
                console.log(`pixel created at ${row} ${col}`);
            };
        };
        console.log('pixels: ', this.pixels);
    };

/* DRAW STUFF */

    findAvailable(country: { color: string, available: number[][] }, p: p5) {
        // Looks in 4 directions from each pixel for free land and adds that free land to the country's available array
        country.available = []
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                if (this.pixels[row][col].type === country.color) {
                    if (this.pixels[constrain(row + 1, 0, this.mapData.length - 1)][col].type === '255, 255, 255') {
                        country.available.push([row + 1, col]);
                    };
                    if (this.pixels[constrain(row - 1, 0, this.mapData.length - 1)][col].type === '255, 255, 255') {
                        country.available.push([row - 1, col]);
                    };
                    if (this.pixels[row][constrain(col + 1, 0, this.mapData[row].length - 1)].type === '255, 255, 255') {
                        country.available.push([row, col + 1]);
                    };
                    if (this.pixels[row][constrain(col - 1, 0, this.mapData[row].length - 1)].type === '255, 255, 255') {
                        country.available.push([row, col - 1]);
                    };
                };
            };
        };
    };

    update(p: p5, country: Country) {
        this.findAvailable(country, p);
        // Each tick, each country will only use about a third of its resources, rounded down, and won't "mobilize" more resources than available land
        let usableResources: number = constrain(Math.floor(country.resources / 3), 0, country.available.length);
        // Conquer a random pixel of available land (later i will add strategic assets)
        if (usableResources > 0) {
            for (let rsrc = 0; rsrc < usableResources; rsrc++) {
                let conquerablePixel = country.available[Math.floor(Math.random() * country.available.length)];
                this.pixels[conquerablePixel[0]][conquerablePixel[1]].type = country.color;
            };
        } else {
            // Or if there are at least 5 resources and available land, build a city or farm
            usableResources = Math.max(Math.floor(country.resources / 3), 0);
            if (usableResources > 5 && this.pixels.some(row => row.some(pixel => pixel.type === country.color && pixel.feature === ''))) {
                // Find a good pixel to become a feature
                let featurePixel = [constrain(Math.floor(Math.random() * this.pixels.length), 0, this.pixels.length - 1), 0];
                console.log(featurePixel, this.pixels[featurePixel[0]])
                featurePixel[1] = constrain(Math.floor(Math.random() * this.pixels[featurePixel[0]].length), 0, this.pixels[featurePixel[0]].length - 1);
                while (this.pixels[featurePixel[0]][featurePixel[1]].type !== country.color || this.pixels[featurePixel[0]][featurePixel[1]].feature !== '') {
                    featurePixel = [constrain(Math.floor(Math.random() * this.pixels.length), 0, this.pixels.length - 1), constrain(Math.floor(Math.random() * this.pixels[0].length), 0, this.pixels[0].length - 1)];
                }
                // Check for bordering features and develop the feature into a suburb accordingly
                let featureCandidate = ['city', 'arable'][Math.floor(Math.random() * 2)];
                let borderingFeature = this.findBorderingFeature(featurePixel[0], featurePixel[1]);
                if (borderingFeature !== '') {
                    featureCandidate = 'suburb';
                };
                this.pixels[featurePixel[0]][featurePixel[1]].feature = featureCandidate;
                this.featureMatrix[featurePixel[0]][featurePixel[1]] = this.pixels[featurePixel[0]][featurePixel[1]].feature;
                country.resources -= usableResources;
            };
        };
        // Add 4/3 of the resources it just used because that makes sense (when i add more factors like economy this factor will change)
        country.resources -= usableResources;
        country.resources += Math.max(Math.floor(4 * usableResources / 3), 0);
    };

    drawFeatureSymbols(p: p5) {
        // Add symbol for each feature
        console.log(this.featureMatrix);
        for (let row = 0; row < this.featureMatrix.length; row++) {
            for (let col = 0; col < this.featureMatrix[row].length; col++) {
                const feature = this.featureMatrix[row][col];
                if (!feature) continue;

                const img = this.featureMap[feature];
                if (!img) continue;

                // The icons come black, so turn each pixel white
                img.loadPixels();
                for (let x = 0; x < img.width; x++) {
                    for (let y = 0; y < img.height; y++) {
                        const index = (x + y * img.width) * 4;
                        const alpha = img.pixels[index + 3];
                        if (alpha > 0) {
                            img.pixels[index] = 255;
                            img.pixels[index + 1] = 255;
                            img.pixels[index + 2] = 255;
                        };
                    };
                };
                img.updatePixels();

                p.image(img, col * this.size, row * this.size, this.size, this.size);
            };
        };
    };

    findBorderingFeature(row: number, col: number) {
        // Check the four adjacent pixels for bordering features
        const neighbors = [
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1]
        ];
        let feature = '';
        for (let [row, col] of neighbors) {
            if (row >= 0 && row < this.pixels.length && col >= 0 && col < this.pixels[0].length) {
                feature = this.pixels[row][col].feature;
                if (feature === 'city' || feature === 'capital') {
                    return feature;
                }
            }
        }
        if (feature === 'arable') {
            return feature;
        }
        return '';
    };
};

export default SimMap;