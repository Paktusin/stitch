import {Entity} from "./entity";
import {PaletteType} from "./paletteType";
import {Cell} from "./cell";

export class Project extends Entity {
    name: string = 'new Project';
    grid: GridType = {};
    palette: PaletteType = {};
    height: number = 100;
    width: number = 100;
    color: string = '#fff';
    picture?: Picture;
}

export interface Picture {
    opacity: number;
    left: number,
    top: number,
    height: number,
    sHeight: number,
    width: number,
    sWidth: number,
    data?: string;
}


export type GridType = { [key: number]: { [key: number]: Cell } };
