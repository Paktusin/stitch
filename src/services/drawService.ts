import {Stitch} from '../types/stitch';
import {CanvasType} from '../types/canvas';
import {ZoomType} from "../types/zoom";

const STITCH_SIZE = 8;

export const drawService = {
    drawStitch(ctx: CanvasRenderingContext2D, stitch: Stitch, x: number, y: number, size: number) {
        ctx.fillStyle = stitch.color;
        ctx.fillRect(x, y, size, size);
        ctx.shadowBlur = 6
        ctx.shadowColor = "#666";
    },

    drawGrid(ctx: CanvasRenderingContext2D, canvasData: CanvasType) {
        const {stitches, zoom} = canvasData;
        stitches.forEach((stitchArray, rowIndex) => {
            stitchArray.forEach((stitch, colIndex) => {
                this.drawStitch(ctx, stitch,
                    this.zoomedX(colIndex * STITCH_SIZE, zoom),
                    this.zoomedY(rowIndex * STITCH_SIZE, zoom),
                    this.zoomed(STITCH_SIZE, zoom)
                );

            })
        });
    },

    zoomed(number: number, zoom: ZoomType) {
        return Math.floor(number * zoom.scale);
    },

    zoomedX(number: number, zoom: ZoomType) {
        return Math.floor((number - zoom.wx) * zoom.scale + zoom.sx);
    },

    zoomedY(number: number, zoom: ZoomType) {
        return Math.floor((number - zoom.wy) * zoom.scale + zoom.sy);
    }
}
