class Country {
    name: string;
    color: string;
    available: number[][];
    resources: number;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
        this.available = [];
        this.resources = 10;
    };
};

export default Country;