import {SymbolType} from "./symbol";

export interface Stitch {
    direction: 'r' | 'l' | 't' | 'b' | 'tr' | 'tl' | 'br' | 'bl' | 'f'
    type: StitchType;
    symbol: SymbolType;
}

export type StitchType = 'x' | 'vx' | 'hx' | 'sx' | 'qx' | '3qx' | '\\' | '/'
