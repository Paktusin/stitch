import {StitchType, stitchTypes} from "../types/stitch";
import qx3 from '../assets/qx3.svg';
import sx from '../assets/sx.svg';
import half from '../assets/half.svg';
import x from '../assets/x.svg';
import qx from '../assets/qx.svg';
import vx from '../assets/vx.svg';
import hx from '../assets/hx.svg';

export interface StitchImages {
    [key: string]: { path: string, data: string, rotate: number }
}

export const getStitchImages = (): StitchImages => ({
    [stitchTypes[0]]: {path: x,},
    [stitchTypes[1]]: {path: vx,},
    [stitchTypes[2]]: {path: hx,},
    [stitchTypes[3]]: {path: sx,},
    [stitchTypes[4]]: {path: qx,},
    [stitchTypes[5]]: {path: qx3,},
    [stitchTypes[6]]: {path: half,},
    [stitchTypes[7]]: {path: half, rotate: 90},
} as any)

export const getStitchImage = (type: StitchType) => {
    return getStitchImages()[type];
}

export async function getStitchImagesData(): Promise<StitchImages> {
    const urls = getStitchImages();
    for (let key in urls) {
        urls[key].data = await getData(urls[key].path);
    }
    return urls;
}

const getData = (path: string): Promise<string> => {
    return fetch(path).then(res => res.text())
}
