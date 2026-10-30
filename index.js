import SimMap from './src/SimMap.ts';
const l /*land*/ = "255, 255, 255";
const w /*water*/ = "0, 0, 255";
const wakanda = "0, 255, 0";
const panem = "255, 255, 0";
function sketch(p) {
    p.setup = () => {
        p.createCanvas(900, 900);
        const simMap = new SimMap(w, l, wakanda, panem);
        simMap.createMap(p);
    };
}
;
export default sketch;
