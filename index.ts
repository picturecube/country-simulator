import p5 from 'p5';
import SimMap from './src/SimMap.ts'
import MapPixel from './src/MapPixel.ts';

const l /*land*/ = "255, 255, 255";
const w /*water*/ = "0, 0, 255";
const wakanda  = "0, 255, 0";
const panem = "255, 255, 0";



function sketch(p: p5) {
    p.setup = () => {
        p.createCanvas(900, 900);
        let simMap = new SimMap(w, l, wakanda, panem);
        simMap.createMap(p);
        console.log('doing p5 setup')
        console.log(simMap)
    };
};

new p5(sketch);