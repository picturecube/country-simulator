class MapPixel {
    type;
    x;
    y;
    size;
    constructor(type, x, y, size) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
    }
    update(type, x, y, size, p) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
    }
    draw(p) {
        p.fill(parseInt(this.type.split(', ')[0]), parseInt(this.type.split(', ')[1]), parseInt(this.type.split(', ')[2]));
        p.rect(this.x * this.size, this.y * this.size, this.size);
    }
}
export default MapPixel;
