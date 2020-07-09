import {SymbolType} from "./symbol";

export interface Stitch {
    directions: Direction[];
    type: StitchType;
    symbol: SymbolType;
}

export const stitchTypes = ['x', 'vx', 'hx', 'sx', 'qx', '3qx', '\\', '/']

export type StitchType = typeof stitchTypes[number]

export type Direction = 'tr' | 'tl' | 'br' | 'bl';
