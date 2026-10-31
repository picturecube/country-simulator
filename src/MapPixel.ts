import p5 from 'p5';
class MapPixel {
    type: string;
    x: number;
    y: number;
    size: number;
    constructor(type: ({ color: string } | string), x: number, y: number, size: number) {
        // will accept both the variable l for land which is the string '255, 255, 255' or a country object cuz why not
        if (typeof(type) === 'object') {
            this.type = type.color
        } else {
            this.type = type
        }
        this.x = x;
        this.y = y;
        this.size = size;
        console.log(`Map pixel constructor for ${type} ${x} ${y}`)
    }

    draw(p: p5) {
        // separates the string color into 3 integers for p5 to use
        p.fill(parseInt(this.type.split(', ')[0]), parseInt(this.type.split(', ')[1]), parseInt(this.type.split(', ')[2]));
        p.noStroke();
        // this allows each rectangle to be a neat grid of 100 px squares
        p.rect(this.y * this.size, this.x * this.size, this.size);
    }
}

export default MapPixel;