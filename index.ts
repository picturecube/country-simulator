import p5 from 'p5';
import SimMap from './src/SimMap.ts'
import $ from 'jquery';
const l /*land*/ = "255, 255, 255";
const w /*water*/ = "0, 0, 255";
// wakanda forever
// rip chadwick boseman
const wakanda  = "0, 255, 0";
// get ready for the 76th hunger games
const panem = "255, 255, 0";
let simMap: SimMap;

function sketch(p: p5) {
    p.setup = () => {
        p.createCanvas(900, 900, p.WEBGL);
        p.background(255, 255, 255);
        simMap = new SimMap(w, l, wakanda, panem);
        simMap.createMap(p);
        console.log('doing p5 setup');
        p.frameRate(60);
    };

    p.draw = () => {
        // move origin to corner because webgl origin is center
        p.translate(-0.5 * p.width, -0.5 * p.height);
        // since the frame rate is 60, eack tick is half a second
        if (p.frameCount % 30 === 2) {
            simMap.update(p);
            console.log('wakanda avialable px', simMap.wakanda.available);
            console.log('panem available px', simMap.panem.available);

            // draw each pixel
        for (let row = 0; row < simMap.mapData.length; row++) {
            for (let col = 0; col < simMap.mapData[row].length; col++) {
                simMap.pixels[row][col].draw(p);
            };
        };
        };
    };
};

new p5(sketch);

// reset button
$('body').append('<button onclick="window.location.reload()">Reset</button>')