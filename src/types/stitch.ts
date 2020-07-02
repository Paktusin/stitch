export interface Stitch {
    direction: Direction
    type: StitchType;
}

export const stitchTypes = [
    'x', 'vx', 'hx', 'sx', 'qx', '3qx', '\\', '/'
]

export type StitchType = typeof stitchTypes[number]

export type Direction = 'r' | 'l' | 't' | 'b' | 'tr' | 'tl' | 'br' | 'bl' | 'f';
