import p5 from 'p5';
import MapPixel from './MapPixel.ts'
class SimMap {
    mapData: string[][];
    size = 100;
    pixels: MapPixel[][] = [[], [], [], [], [], [], [], [], []]

    constructor(w: string, l: string, wakanda: string, panem: string) {
        this.mapData = [[w,       w, w, w, l, w, w, w,     w],
                        [w,       w, w, l, l, l, w, w,     w],
                        [w,       w, l, l, l, l, l, w,     w],
                        [w,       l, l, l, l, l, l, l,     w],
                        [wakanda, l, l, l, l, l, l, l, panem],
                        [w,       l, l, l, l, l, l, l,     w],
                        [w,       w, l, l, l, l, l, w,     w],
                        [w,       w, w, l, l, l, w, w,     w],
                        [w,       w, w, w, l, w, w, w,     w]];
    };

    createMap(p: p5) {
        console.log('creating map')
        console.log(this.mapData)
        for (let row = 0; row < this.mapData.length; row++) {
            for (let col = 0; col < this.mapData[row].length; col++) {
                this.pixels[row].push(new MapPixel(this.mapData[row][col], row, col, this.size));
                this.pixels[row][col].draw(p);
                console.log(`pixel created at ${row} ${col}`)
            };
        };
    };
};

export default SimMap;