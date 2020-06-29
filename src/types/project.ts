import {Cell} from "./cell";

export class Project {
    id?: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    stitches: Cell[][] = [];

    constructor() {
        this.name = 'new Project';
        this.createdAt = new Date().getTime();
        this.updatedAt = new Date().getTime();
    }
}

