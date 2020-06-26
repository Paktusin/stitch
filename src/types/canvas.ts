import {Stitch} from "./stitch";
import {ZoomType} from "./zoom";

export type CanvasType = {
    zoom: ZoomType
    backgroundColor: string;
    stitches: Stitch[][];
}
