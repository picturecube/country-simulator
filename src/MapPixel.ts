import p5 from 'p5';
class MapPixel {
    type: string;
    x: number;
    y: number;
    size: number;
    constructor(type: ({ color: string } | string), x: number, y: number, size: number) {
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

    update(type: string, x: number, y: number, size: number, p: p5) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw(p: p5) {
        p.fill(parseInt(this.type.split(', ')[0]), parseInt(this.type.split(', ')[1]), parseInt(this.type.split(', ')[2]));
        p.noStroke();
        p.rect(this.y * this.size, this.x * this.size, this.size);
    }
}

export default MapPixel;