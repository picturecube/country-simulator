
/* Resources: each pixel conquered consumes 1 resource
and each tick each country will use 1/3 of the resources it has, rounded down. 
Also, they will gain 4/3 of the resources it used, rounded down. */

/* Available: an array of all the pixels that are adjacent to a country's pixels and are free land
so that the country can conquer them in the next tick. */

class Country {
    name: string;
    color: string;
    available: number[][];
    resources: number;
    colorMode: 'light' | 'dark';

    constructor(name: string, color: string, colorMode: 'light' | 'dark') {
        this.name = name;
        this.color = color;
        this.available = [];
        this.resources = 10;
        this.colorMode = colorMode;
    };
};

export default Country;