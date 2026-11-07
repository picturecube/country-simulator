import p5 from 'p5';
import SimMap from './SimMap';
import MapPixel from './MapPixel.ts';
function processMouse(p: p5, simMap: SimMap, font: p5.Font, bold: p5.Font) {
    /* divides the mouse coordinates by the size of each pixel to get the pixel coordinates */
    let pixelHovered: MapPixel;
    try {
        pixelHovered = simMap.pixels[Math.floor(p.mouseY / simMap.size)][Math.floor(p.mouseX / simMap.size)];
    
        if (typeof pixelHovered !== 'undefined') {
            let countryHovered = 'Land';
            function getTooltipText() { 
                return `${countryHovered} pixel: ${pixelHovered.x}, ${pixelHovered.y}, rgb(${pixelHovered.type}), ${pixelHovered.feature === '' ? 'No feature' : pixelHovered.feature}`
            };
            p.textFont(font);
            p.textSize(12);
            // add tooltip and cool colored country names
            if (pixelHovered.type === '255, 0, 0') {
                countryHovered = 'Cindercrest';
                p.fill(0, 0, 0, 200);
                p.rect(0, 0, p.textWidth(getTooltipText()) + 20, 32);
                p.fill(255, 255, 255);
                p.text(getTooltipText(), 10, 20);
                p.fill(255, 0, 0);
                p.textFont(bold);
                p.text('Cindercrest', 10, 20);
            } else if (pixelHovered.type === '0, 0, 0') {
                countryHovered = 'Null';
                p.fill(0, 0, 0, 200);
                p.rect(0, 0, p.textWidth(getTooltipText()) + 20, 32);
                p.fill(255, 255, 255);
                p.text(getTooltipText(), 10, 20);
                p.fill(255, 255, 255);
                p.textFont(bold);
                p.text('Null', 10, 20);
            } else if (pixelHovered.type === '255, 255, 255') {
                countryHovered = 'Land';
                p.fill(0, 0, 0, 200);
                p.rect(0, 0, p.textWidth(getTooltipText()) + 20, 32);
                p.fill(255, 255, 255);
                p.text(getTooltipText(), 10, 20);
            } else if (pixelHovered.type === '0, 0, 255') {
                countryHovered = 'Water';
                p.fill(0, 0, 0, 200);
                p.rect(0, 0, p.textWidth(getTooltipText()) + 20, 32);
                p.fill(255, 255, 255);
                p.text(getTooltipText(), 10, 20);
            } else if (pixelHovered.type === '255, 255, 0') {
                countryHovered = 'Parrot Civ';
                p.fill(0, 0, 0, 200);
                p.rect(0, 0, p.textWidth(getTooltipText()) + 20, 32);
                p.fill(255, 255, 255);
                p.text(getTooltipText(), 10, 20);
                p.fill(255, 255, 0);
                p.textFont(bold);
                p.text('Parrot Civ', 10, 20);
            } else if (pixelHovered.type === '0, 255, 0') {
                countryHovered = 'LAW';
                p.fill(0, 0, 0, 200);
                p.rect(0, 0, p.textWidth(getTooltipText()) + 20, 32);
                p.fill(255, 255, 255);
                p.text(getTooltipText(), 10, 20);
                p.fill(0, 255, 0);
                p.textFont(bold);
                p.text('LAW', 10, 20);
            } else if (pixelHovered.type === '255, 165, 0') {
                countryHovered = 'Nether';
                p.fill(0, 0, 0, 200);
                p.rect(0, 0, p.textWidth(getTooltipText()) + 20, 32);
                p.fill(255, 255, 255);
                p.text(getTooltipText(), 10, 20);
                p.fill(255, 165, 0);
                p.textFont(bold);
                p.text('Nether', 10, 20);
            };
        };
    } catch (TypeError) {
    };
};
export default processMouse;