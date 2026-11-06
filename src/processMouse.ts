import p5 from 'p5';
import SimMap from './SimMap';
import constrain from './constrain.ts';
function processMouse(p: p5, simMap: SimMap, font: p5.Font, bold: p5.Font) {
    /* divides the mouse coordinates by the size of each pixel to get the pixel coordinates, then constrains it to the map so if 
    the pointer is out of bounds, it just returns the nearest pixel */
    let pixelHovered = simMap.pixels[constrain(Math.floor(p.mouseY / simMap.size), 0, simMap.mapData.length - 1)][constrain(Math.floor(p.mouseX / simMap.size), 0, simMap.mapData[0].length - 1)];
    console.log(`pixel hovered: ${pixelHovered.x}, ${pixelHovered.y}, rgb(${pixelHovered.type}), ${pixelHovered.feature}`);
    p.textFont(font);
    p.textSize(12);
    p.fill(0, 0, 0);
    // add tooltip and cool colored country names
    if (pixelHovered.type === '255, 0, 0') {
        p.text(`Cindercrest pixel: ${pixelHovered.x}, ${pixelHovered.y}, rgb(${pixelHovered.type}), ${pixelHovered.feature === '' ? 'No feature' : pixelHovered.feature}`, 10, 20);
        p.fill(255, 0, 0);
        p.textFont(bold);
        p.text('Cindercrest', 10, 20);
    } else if (pixelHovered.type === '0, 0, 0') {
        p.text(`Null pixel: ${pixelHovered.x}, ${pixelHovered.y}, rgb(${pixelHovered.type}), ${pixelHovered.feature === '' ? 'No feature' : pixelHovered.feature}`, 10, 20);
        p.fill(0, 0, 0);
        p.textFont(bold);
        p.text('Null', 10, 20);
    } else if (pixelHovered.type === '255, 255, 255') {
        p.text(`Land pixel: ${pixelHovered.x}, ${pixelHovered.y}, rgb(${pixelHovered.type}), ${pixelHovered.feature === '' ? 'No feature' : pixelHovered.feature}`, 10, 20);
    } else if (pixelHovered.type === '0, 0, 255') {
        p.text(`Water pixel: ${pixelHovered.x}, ${pixelHovered.y}, rgb(${pixelHovered.type}), ${pixelHovered.feature === '' ? 'No feature' : pixelHovered.feature}`, 10, 20);
    } else if (pixelHovered.type === '255, 255, 0') {
        p.text(`Parrot Civ pixel: ${pixelHovered.x}, ${pixelHovered.y}, rgb(${pixelHovered.type}), ${pixelHovered.feature === '' ? 'No feature' : pixelHovered.feature}`, 10, 20);
        p.fill(255, 255, 0);
        p.textFont(bold);
        p.text('Parrot Civ', 10, 20);
    } else if (pixelHovered.type === '0, 255, 0') {
        p.text(`LAW pixel: ${pixelHovered.x}, ${pixelHovered.y}, rgb(${pixelHovered.type}), ${pixelHovered.feature === '' ? 'No feature' : pixelHovered.feature}`, 10, 20);
        p.fill(0, 255, 0);
        p.textFont(bold);
        p.text('LAW', 10, 20);
    } else if (pixelHovered.type === '255, 165, 0') {
        p.text(`Nether pixel: ${pixelHovered.x}, ${pixelHovered.y}, rgb(${pixelHovered.type}), ${pixelHovered.feature === '' ? 'No feature' : pixelHovered.feature}`, 10, 20);
        p.fill(255, 165, 0);
        p.textFont(bold);
        p.text('Nether', 10, 20);
    }
};
export default processMouse;