class Troop {
    population: number;
    food: number;
    constructor(pop: number, food: number) {
        this.population = pop;
        this.food = food;
    }
}

class ActiveTroop extends Troop {
    active = true as const;
}

class InactiveTroop extends Troop {
    active = false as const;
}

export { Troop, ActiveTroop, InactiveTroop };