import {Cell} from "./cell";
import {Entity} from "./entity";

export class Project extends Entity {
    name: string;
    createdAt: number;
    updatedAt: number;
    grid: Cell[][] = [];

    constructor() {
        super();
        this.name = 'new Project';
        this.createdAt = new Date().getTime();
        this.updatedAt = new Date().getTime();
    }
}

