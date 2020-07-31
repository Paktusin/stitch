import {StitchType, stitchTypes} from "../types/stitch";
import qx3 from '../assets/qx3.svg';
import sx from '../assets/sx.svg';
import half from '../assets/half.svg';
import x from '../assets/x.svg';
import qx from '../assets/qx.svg';
import vx from '../assets/vx.svg';
import hx from '../assets/hx.svg';

export const getSvg = (type: StitchType) => {
    const svg = {
        [stitchTypes[0]]: {path: x,},
        [stitchTypes[1]]: {path: vx,},
        [stitchTypes[2]]: {path: hx,},
        [stitchTypes[3]]: {path: sx,},
        [stitchTypes[4]]: {path: qx,},
        [stitchTypes[5]]: {path: qx3,},
        [stitchTypes[6]]: {path: half,},
        [stitchTypes[7]]: {path: half, rotate: 90},
    }
    return svg[type];
}
