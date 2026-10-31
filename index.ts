import p5 from 'p5';
import SimMap from './src/SimMap.ts'
import jquery from 'jquery';
const l /*land*/ = "255, 255, 255";
const w /*water*/ = "0, 0, 255";
const wakanda  = "0, 255, 0";
const panem = "255, 255, 0";
const $ = new jquery();
let simMap: SimMap;



function sketch(p: p5) {
    p.setup = () => {
        p.createCanvas(900, 900, p.WEBGL);
        p.noSmooth();
        p.background(255, 255, 255);
        simMap = new SimMap(w, l, wakanda, panem);
        simMap.createMap(p);
        console.log('doing p5 setup');
        p.frameRate(60);
    };

    p.draw = () => {
        p.translate(-0.5 * p.width, -0.5 * p.height);
        if (p.frameCount % 30 === 2) {
            simMap.update(p);
            console.log('wakanda avialable px', simMap.wakanda.available);
            console.log('panem available px', simMap.panem.available);
        };
    };
};

new p5(sketch);