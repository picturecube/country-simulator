import p5 from 'p5';
import SimMap from './src/SimMap.ts'
import $ from 'jquery';
const l /*land*/ = "255, 255, 255";
const w /*water*/ = "0, 0, 255";
// wakanda forever
// rip chadwick boseman
const cindercrest  = "0, 255, 0";
// get ready for the 76th hunger games
const nullEmpire = "255, 255, 0";
let simMap: SimMap;
let materialSymbolsRounded: p5.Font;
let testFontCOURIERPRIME: p5.Font;

function sketch(p: p5) {
     p.setup = async () => {
        p.createCanvas(900, 900, p.WEBGL);
        p.background(255, 255, 255);
        simMap = new SimMap(w, l, cindercrest, nullEmpire);
        simMap.createMap(p);
        console.log('doing p5 setup');
        p.frameRate(60);
        materialSymbolsRounded = await p.loadFont("./fonts/MaterialIconsRound-Regular.otf");
        testFontCOURIERPRIME =  await p.loadFont('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap')
        $('main:has(.p5Canvas)').append('<div id="buttonsContainer"></div>');
        $('main:has(.p5Canvas)').prepend('<div id="canvasContainer"></div>');
        $('#canvasContainer').append($('.p5Canvas'));
        // reset button
        let resetButton = p.createButton('Reset').class('resetButton').mousePressed(() => {
            window.location.reload();
        });
        $('#buttonsContainer').append($('.resetButton'));
    };

    p.draw = () => {
        // move origin to corner because webgl origin is center
        p.translate(-0.5 * p.width, -0.5 * p.height);
        // since the frame rate is 60, eack tick is half a second
        if (p.frameCount % 30 === 2) {
            // draw each pixel
            for (let row = 0; row < simMap.mapData.length; row++) {
                for (let col = 0; col < simMap.mapData[row].length; col++) {
                    simMap.pixels[row][col].draw(p);
                };
            };

            simMap.update(p, materialSymbolsRounded);
            console.log('cindercrest available px', simMap.cindercrest.available);
            console.log('nullEmpire available px', simMap.nullEmpire.available);
        };
    };
};

new p5(sketch);