import p5 from 'p5';
import SimMap from './src/SimMap.ts'
import $ from 'jquery';
import processMouse from './src/processMouse.ts';
import mapData from './src/mapData.ts';
import { cindercrest, nullEmpire, parrotCiv, law, nether, l, w } from './src/colorData.ts';
import Perlin from './src/perlin.ts';

const startingMapData = mapData;
let simMap: SimMap;
let testFontCOURIERPRIME: p5.Font;
let testFontCOURIERPRIMEBold: p5.Font;
let isPaused = false;
let fs = false;
const canvasSize = window.innerHeight;
const featureNoise = new Perlin(Math.random());
let featuresBuffer: p5.Graphics

function sketch(p: p5) {
     p.setup = async () => {
        /* GRAPHICS */
        p.createCanvas(canvasSize, canvasSize, p.WEBGL);
        p.frameRate(15);
        p.noSmooth();
        featuresBuffer = p.createGraphics(canvasSize, canvasSize);
        featuresBuffer.pixelDensity(1);

        /* OBJECTS */
        simMap = new SimMap(w, l, startingMapData, p);
        simMap.createMap(p);

        /* ASSETS */
        testFontCOURIERPRIME = await p.loadFont('./fonts/Courier Prime.ttf');
        testFontCOURIERPRIMEBold = await p.loadFont('./fonts/Courier Prime Bold.ttf');

        /* BUTTONS */
        $('main:has(.p5Canvas)').append('<div id="buttonsContainer"></div>');
        $('main:has(.p5Canvas)').prepend('<div id="canvasContainer"></div>');
        $('#canvasContainer').append($('.p5Canvas')).css({height: `${canvasSize}px`});
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
                    objectFit: 'contain'
                });
                $('canvas').css({
                    height: '100vh',
                    width: '100vh',
                    objectFit: 'contain'
                });
                fs = true;
                $('main')[0].requestFullscreen();
            } else if (fs === true) {
                $('main').css({
                    width: '',
                    objectFit: ''
                });
                $('canvas').css({
                    height: '',
                    width: '',
                    objectFit: ''
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

        featuresBuffer.clear();
        simMap.drawFeatureSymbols(featuresBuffer);
        p.image(featuresBuffer, 0, 0)

        processMouse(p, simMap, testFontCOURIERPRIME, testFontCOURIERPRIMEBold);
        const speed = 20;
        // Game tick logic
        if (!isPaused) {
            for (let x = 0; x < speed; x++) {
                simMap.update(p, cindercrest, featureNoise);
                simMap.update(p, nullEmpire, featureNoise);
                simMap.update(p, parrotCiv, featureNoise);
                simMap.update(p, law, featureNoise);
                simMap.update(p, nether, featureNoise);
            };
        };
    };
};

new p5(sketch);