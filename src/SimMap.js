import MapPixel from './MapPixel.ts';
class SimMap {
    mapData;
    size = 100;
    pixels = [[], [], [], [], [], [], [], [], []];
    constructor(w, l, wakanda, panem) {
        this.mapData = [[w, w, w, w, l, w, w, w, w],
            [w, w, w, l, l, l, w, w, w],
            [w, w, l, l, l, l, l, w, w],
            [w, l, l, l, l, l, l, l, w],
            [wakanda, l, l, l, l, l, l, l, panem],
            [w, l, l, l, l, l, l, l, w],
            [w, w, l, l, l, l, l, w, w],
            [w, w, w, l, l, l, w, w, w],
            [w, w, w, w, l, w, w, w, w]];
    }
    ;
    createMap(p) {
        for (let row = 0; row === this.mapData.length; row++) {
            for (let col = 0; col === this.mapData[row].length; col++) {
                this.pixels[row].push(new MapPixel(this.mapData[row][col], row, col, this.size));
                this.pixels[row][col].draw(p);
            }
            ;
        }
        ;
    }
    ;
}
;
export default SimMap;
