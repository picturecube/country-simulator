import p5 from 'p5';
import SimMap from './src/SimMap.ts'
import $ from 'jquery';
import processMouse from './src/processMouse.ts';
import mapData from './src/mapData.ts';
import { cindercrest, nullEmpire, parrotCiv, law, nether, l, w } from './src/colorData.ts';

const startingMapData = mapData;
console.log(startingMapData);
let simMap: SimMap;
let materialSymbolsRounded: p5.Font;
let testFontCOURIERPRIME: p5.Font;
let testFontCOURIERPRIMEBold: p5.Font;
let domainIcon: p5.Image;

function sketch(p: p5) {
     p.setup = async () => {
        p.createCanvas(980, 980, p.WEBGL);
        simMap = new SimMap(w, l, startingMapData, p);
        simMap.createMap(p);
        console.log('doing p5 setup');
        p.frameRate(30);
        testFontCOURIERPRIME = await p.loadFont('./fonts/Courier Prime.ttf');
        testFontCOURIERPRIMEBold = await p.loadFont('./fonts/Courier Prime Bold.ttf');
        domainIcon = await p.loadImage('https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/src/social/domain/materialiconsround/24px.svg');
        domainIcon.width = 24;
        domainIcon.height = 24;
        console.log(domainIcon.width, domainIcon.height);

        $('main:has(.p5Canvas)').append('<div id="buttonsContainer"></div>');
        $('main:has(.p5Canvas)').prepend('<div id="canvasContainer"></div>');
        $('#canvasContainer').append($('.p5Canvas'));
        // reset button
        const resetButton = p.createButton('Reset').class('resetButton').mousePressed(() => {
            window.location.reload();
        });

        $('#buttonsContainer').append($('.resetButton'));
    };

    p.draw = () => {
        p.background(255, 255, 255);
        // move origin to corner because webgl origin is center
        p.translate(-0.5 * p.width, -0.5 * p.height);
        
        // draw each pixel
        for (let row = 0; row < simMap.mapData.length; row++) {
            for (let col = 0; col < simMap.mapData[row].length; col++) {
                simMap.pixels[row][col].draw(p);
            };
        };

        simMap.drawFeatureSymbols(p);

        processMouse(p, simMap, testFontCOURIERPRIME, testFontCOURIERPRIMEBold);

        // since the frame rate is 30, each tick is half a second
        //if (p.frameCount % 15 === 0) {
            simMap.update(p, cindercrest);
            simMap.update(p, nullEmpire);
            simMap.update(p, parrotCiv);
            simMap.update(p, law);
            simMap.update(p, nether);
            console.log(cindercrest, nullEmpire, parrotCiv, law, nether);
        //};
    };
};

new p5(sketch);
export { cindercrest, nullEmpire, parrotCiv, law, nether, l, w };