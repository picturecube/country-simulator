/* SETUP STUFF */

import p5 from 'p5';
import MapPixel from './MapPixel.ts'
import Country from './Country.ts';
import constrain from "./constrain.ts";
import Perlin from './perlin.ts';
import { Troop, InactiveTroop, ActiveTroop } from './Troop.ts';

class SimMap {
    // The map is a 9x9 grid of pixels and each pixel is 100x100 px
    // The data is either the color or a country object with a color property
    mapData: ( string | Country )[][];

    /**/

    size: number;
    // The pixel objects are stored in a separate array because they are for displaying the map only
    pixels: MapPixel[][] = Array.from({ length: 49 }, () => Array(49).fill(null));
    // This object maps the feature to the material symbol that will be drawn on the map
    featureMap: Record<string, p5.Image[]> = {};
    async fillFeatureMap(p: p5) {
        this.featureMap.city = [await p.loadImage('../assets/domain_48px-light.svg'), await p.loadImage('../assets/domain_48px-dark.svg')];
        this.featureMap.arable = [await p.loadImage('../assets/agriculture_48px-light.svg'), await p.loadImage('../assets/agriculture_48px-dark.svg')];
        this.featureMap.capital = [await p.loadImage('../assets/stars_48px-light.svg'), await p.loadImage('../assets/stars_48px-dark.svg')];
        this.featureMap.suburb = [await p.loadImage('../assets/location_city_48px-light.svg'), await p.loadImage('../assets/location_city_48px-dark.svg')];
    };

    constructor(w: string, l: string, mapData: (string | Country)[][], p: p5) {
        this.mapData = mapData;
        this.size = p.height / this.mapData.length;

        this.fillFeatureMap(p);
    };

    createMap(p: p5) {
        // Create a pixel object for each pixel
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                let feature = '';
                if (typeof(this.mapData[row][col]) === 'object') {
                    feature = 'capital';
                };
                this.pixels[row][col] = new MapPixel(this.mapData[row][col], row, col, this.size, feature);
            };
        };
    };

/* DRAW STUFF */

    findAvailable(country: { color: string, available: number[][] }, p: p5) {
        // Looks in 4 directions from each pixel for free land and adds that free land to the country's available array
        country.available = []
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                if (this.pixels[row][col].type === country.color) {
                    if (this.pixels[constrain(row + 1, 0, this.mapData.length - 1)][col].type === '255, 255, 255') {
                        if (!country.available.includes([row + 1, col])) {
                            country.available.push([row + 1, col]);
                        };
                    };
                    if (this.pixels[constrain(row - 1, 0, this.mapData.length - 1)][col].type === '255, 255, 255') {
                        if (!country.available.includes([row - 1, col])) {
                            country.available.push([row - 1, col]);
                        };
                    };
                    if (this.pixels[row][constrain(col + 1, 0, this.mapData[row].length - 1)].type === '255, 255, 255') {
                        if (!country.available.includes([row, col + 1])) {
                            country.available.push([row, col + 1]);
                        };
                    };
                    if (this.pixels[row][constrain(col - 1, 0, this.mapData[row].length - 1)].type === '255, 255, 255') {
                        if (!country.available.includes([row, col - 1])) {
                            country.available.push([row, col - 1]);
                        };
                    };
                };
            };
        };
    };

    update(p: p5, country: Country, noise: Perlin) {
        this.findAvailable(country, p);
        // Each tick, each country will use its troops to conquer free land
        let usableTroops: number = constrain(country.troops.length, 0, country.available.length);
        let usableResources: number = 0;
        // Conquer a random pixel of available land (later i will add strategic assets)
        if (usableTroops > 0) {
            for (let trp = 0; trp < usableTroops; trp++) {
                let conquerablePixelIdx = Math.floor(Math.random() * country.available.length);
                let conquerablePixel = country.available[conquerablePixelIdx];
                this.pixels[conquerablePixel[0]][conquerablePixel[1]].type = country.color;
                this.pixels[conquerablePixel[0]][conquerablePixel[1]].colorMode = country.colorMode;
                country.available.splice(conquerablePixelIdx, 1);
            };
        } else {
            // Or if there are at least 5 resources and available land, build a city or farm
            usableTroops = 0;
            usableResources = constrain(5, 0, country.resources);
            if (usableResources === 5 && this.pixels.some(row => row.some(pixel => pixel.type === country.color && pixel.feature === ''))) {
                // Find a good pixel to become a feature
                let featurePixel = [constrain(Math.floor(Math.random() * this.pixels.length), 0, this.pixels.length - 1), 0];
                featurePixel[1] = constrain(Math.floor(Math.random() * this.pixels[featurePixel[0]].length), 0, this.pixels[featurePixel[0]].length - 1);
                while (this.pixels[featurePixel[0]][featurePixel[1]].type !== country.color || this.pixels[featurePixel[0]][featurePixel[1]].feature !== '') {
                    featurePixel = [constrain(Math.floor(Math.random() * this.pixels.length), 0, this.pixels.length - 1), constrain(Math.floor(Math.random() * this.pixels[0].length), 0, this.pixels[0].length - 1)];
                }
                // Check for bordering features and develop the feature into a suburb accordingly
                let featureCandidate: string;
                let population: number;
                const scale = 1
                if (p.noise(featurePixel[0] * scale, featurePixel[1] * scale) < 0.6) {
                    featureCandidate = 'arable';
                    population = 100;
                } else if (p.noise(featurePixel[0] * scale, featurePixel[1] * scale) < 0.7) {
                    featureCandidate = 'suburb';
                    population = 1000;
                } else {
                    featureCandidate = 'city';
                    population = 10000;
                };
                this.pixels[featurePixel[0]][featurePixel[1]].feature = featureCandidate;
                country.resources -= usableResources;

                // increase the population per pixel by 2.2
                for (let row = 0; row < this.mapData.length; row++) {
                    for (let col = 0; col < this.mapData.length; col++) {
                        if (this.pixels[row][col].type === country.color) {
                            this.pixels[row][col].population *= 2.2;
                        };
                    };
                };
            };
        };

        // Deactivate the used troops
        for (let trp = 0; trp < usableTroops; trp++) {
            let activatedTroop: undefined | ActiveTroop = country.troops.shift();
            if (typeof activatedTroop === 'object') {
                let deactivatedTroop = new InactiveTroop(activatedTroop.population, activatedTroop.food - activatedTroop.population);
                country.inactiveTroops.push(deactivatedTroop);
            };
        };
        
        // Add 4/3 of the resources it just used because that makes sense (when i add more factors like economy this factor will change)
        country.resources += Math.round(Math.max(Math.floor(6 * usableResources / 5), 0));

        // add 50 food to surplus food count per arable land

        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                if (this.pixels[row][col].type === country.color && this.pixels[row][col].feature === 'arable') {
                    country.food_surplus += 50;
                }
            }
        }

        // give food surplus to troops that need it

        
        for (let food = 0; food < country.food_surplus; food++) {
            if (country.inactiveTroops.length >= 1) {
                if (country.inactiveTroops[0].food === country.inactiveTroops[0].population) {
                    let deactivatedTroop: InactiveTroop | undefined = country.inactiveTroops.shift();
                    if (typeof deactivatedTroop === 'object') {
                        let activatedTroop = new ActiveTroop(deactivatedTroop.population, deactivatedTroop.food);
                        country.troops.push(activatedTroop);
                    }
                } else {
                    country.inactiveTroops[0].food += 1;
                }
            }
        }
    };

    drawFeatureSymbols(p: p5.Graphics) {
        // Add symbol for each feature
        for (let row = 0; row < this.pixels.length; row++) {
            for (let col = 0; col < this.pixels[row].length; col++) {
                const feature = this.pixels[row][col].feature;
                // Skip pixels without features and only draw if the selected feature has already been loaded
                if (feature === '' || !this.featureMap[feature]) continue
                const img = this.featureMap[feature][this.pixels[row][col].colorMode === 'dark' ? 1 : 0];
                p.image(img, col * this.size, row * this.size, this.size, this.size);
            };
        };
    };
};

export default SimMap;