/* SETUP STUFF */

import p5 from 'p5';
import SimMap from './SimMap';
import Country from './Country.ts';
class MapPixel {
    type: string;
    x: number;
    y: number;
    size: number;
    feature: string;
    colorMode: 'light' | 'dark';

    constructor(type: Country | string, x: number, y: number, size: number, feature: string, map: SimMap) {
        // will accept both the variable l for land which is the string '255, 255, 255' or a country object cuz why not
        if (typeof(type) === 'object') {
            this.type = type.color;
            this.colorMode = type.colorMode;
        } else {
            this.type = type;
            this.colorMode = 'light';
        };
        this.x = x;
        this.y = y;
        this.size = size;
        this.feature = feature;
        map.featureMatrix[this.x][this.y] = this.feature;
    };

/* DRAW STUFF */

    draw(p: p5) {
        // separates the string color into 3 integers for p5 to use
        p.fill(parseInt(this.type.split(', ')[0]), parseInt(this.type.split(', ')[1]), parseInt(this.type.split(', ')[2]));
        p.noStroke();
        // this allows each rectangle to be a neat grid of 100 px squares
        p.rect(this.y * this.size, this.x * this.size, this.size);
    };
};

export default MapPixel;