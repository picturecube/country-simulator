import p5 from 'p5';
import SimMap from './src/SimMap.ts'
import $ from 'jquery';
import processMouse from './src/processMouse.ts';
import mapData from './src/mapData.ts';
import { cindercrest, nullEmpire, parrotCiv, law, nether, l, w } from './src/colorData.ts';

const startingMapData = mapData;
let simMap: SimMap;
let testFontCOURIERPRIME: p5.Font;
let testFontCOURIERPRIMEBold: p5.Font;
let isPaused = false;
let fs = false;

function sketch(p: p5) {
     p.setup = async () => {
        /* GRAPHICS */
        p.createCanvas(980, 980, p.WEBGL);
        p.frameRate(30);
        p.noSmooth();
        /* OBJECTS */
        simMap = new SimMap(w, l, startingMapData, p);
        simMap.createMap(p);

        /* ASSETS */
        testFontCOURIERPRIME = await p.loadFont('./fonts/Courier Prime.ttf');
        testFontCOURIERPRIMEBold = await p.loadFont('./fonts/Courier Prime Bold.ttf');

        /* BUTTONS */
        $('main:has(.p5Canvas)').append('<div id="buttonsContainer"></div>');
        $('main:has(.p5Canvas)').prepend('<div id="canvasContainer"></div>');
        $('#canvasContainer').append($('.p5Canvas')).css({height: '980px'});
        // Reset button
        const resetButton = p.createButton('Reset').class('resetButton controlButtons').mousePressed(() => {
            window.location.reload();
        });
        // Pause button
        const pauseButton = p.createButton('Pause').class('pauseButton controlButtons').mousePressed(() => {
            isPaused = !isPaused;
        });
        // Fullscreen button
        const fullscreenButton = p.createButton('Fullscreen').class('fullscreenButton controlButtons').mousePressed(() => {
            if (fs === false) {
                $('main').css({
                    width: '90vw',
                    height: '100vh',
                    objectFit: 'contain'
                });
                $('canvas').css({
                    height: '100vh',
                    width: '100vh',
                    objectFit: 'contain'
                });
                $('#canvasContainer').css({
                    height: '100vh'
                });
                fs = true;
                $('main')[0].requestFullscreen();
            } else if (fs === true) {
                $('main').css({
                    width: '',
                    height: '',
                    objectFit: ''
                });
                $('canvas').css({
                    height: '',
                    width: '',
                    objectFit: ''
                });
                $('#canvasContainer').css({
                    height: '980px'
                });
                fs = false;
                document.exitFullscreen();
            }
        });
        $('#buttonsContainer').append($('.resetButton'));
        $('#buttonsContainer').append($('.pauseButton'));
        $('#buttonsContainer').append($('.fullscreenButton'));
    };

    p.draw = () => {
        p.background(255, 255, 255);
        // Move origin to corner because WebGL origin is center, but I want the origin to be in the corner
        p.translate(-0.5 * p.width, -0.5 * p.height);
        
        // Draw each pixel
        for (let row = 0; row < simMap.mapData.length; row++) {
            for (let col = 0; col < simMap.mapData[row].length; col++) {
                simMap.pixels[row][col].draw(p);
            };
        };

        simMap.drawFeatureSymbols(p);

        processMouse(p, simMap, testFontCOURIERPRIME, testFontCOURIERPRIMEBold);

        // Game tick logic
        if (!isPaused) {
            simMap.update(p, cindercrest);
            simMap.update(p, nullEmpire);
            simMap.update(p, parrotCiv);
            simMap.update(p, law);
            simMap.update(p, nether);
        };
    };
};

new p5(sketch);