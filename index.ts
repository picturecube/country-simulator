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
let isFullscreen = false;
let tick = 0;
const canvasSize = window.innerHeight;
const featureNoise = new Perlin(Math.random());
let featuresBuffer: p5.Graphics;
const targetFrameRate = 18;
let speedDisplay = 1;

function sketch(p: p5) {
     p.setup = async () => {
        /* GRAPHICS */
        p.createCanvas(canvasSize, canvasSize, p.WEBGL);
        p.frameRate(targetFrameRate);
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
            if (isFullscreen === false) {
                $('main').css({
                    width: '90vw',
                    objectFit: 'contain'
                });
                $('canvas').css({
                    height: '100vh',
                    width: '100vh',
                    objectFit: 'contain'
                });
                isFullscreen = true;
                $('main')[0].requestFullscreen();
            } else if (isFullscreen === true) {
                $('main').css({
                    width: '',
                    objectFit: ''
                });
                $('canvas').css({
                    height: '',
                    width: '',
                    objectFit: ''
                });
                isFullscreen = false;
                document.exitFullscreen();
            }
        });
        // Speed slider
        const speedSlider = p.createSlider(1, 10, 1, 1).class('speedSlider controlButtons');
        $('#buttonsContainer').append($('.resetButton'));
        $('#buttonsContainer').append($('.pauseButton'));
        $('#buttonsContainer').append($('.fullscreenButton'));
        $('#buttonsContainer').append($('<div id="speedContainer"></div>'))
        $('#speedContainer').append($(`<p id="iShowSpeed">Speed: ${speedDisplay}x</p>`));
        $('#speedContainer').append($('.speedSlider'))
    };

    p.draw = () => {
        p.background(255, 255, 255);
        // Move origin to corner because WebGL origin is center, but I want the origin to be in the corner
        p.translate(-0.5 * p.width, -0.5 * p.height);

        // Show speed
        speedDisplay = $('.speedSlider').val();
        $('#iShowSpeed').html(`Speed: ${speedDisplay}x`);
        
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
        tick++;
        const speed = speedDisplay;
        const tickRate = 20;
        const mspt = 1000 / tickRate;
        const ms = Math.floor(p.millis());
        // Game tick logic
        if (!isPaused && (ms / mspt > tick)) {
            for (let x = 0; x < speed; x++) {
                simMap.update(p, cindercrest);
                simMap.update(p, nullEmpire);
                simMap.update(p, parrotCiv);
                simMap.update(p, law);
                simMap.update(p, nether);
            };
        };
    };
};

new p5(sketch);