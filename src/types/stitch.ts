export interface Stitch {
    direction: 'r' | 'l' | 't' | 'b' | 'tr' | 'tl' | 'br' | 'bl' | 'f'
    type: StitchType;
}

export const stitchTypes = ['x', 'vx', 'hx', 'sx', 'qx', '3qx', '\\', '/']

export type StitchType = typeof stitchTypes[number]
