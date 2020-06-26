import {Stitch} from '../models/stitch';
import {CanvasType} from '../models/canvasType';

const STITCH_SIZE = 8;

export const drawService = {
    drawStitch(ctx: CanvasRenderingContext2D, stitch: Stitch, x: number, y: number) {
        ctx.fillStyle = stitch.color;
        ctx.fillRect(x, y, STITCH_SIZE, STITCH_SIZE);
        ctx.shadowBlur = 6
        ctx.shadowColor = "#666";
    },

    drawGrid(ctx: CanvasRenderingContext2D, canvasData: CanvasType) {
        canvasData.stitches.forEach((stitchArray, rowIndex) => {
            stitchArray.forEach((stitch, colIndex) => {
                this.drawStitch(ctx, stitch, colIndex * STITCH_SIZE, rowIndex * STITCH_SIZE);
            })
        });
    }
}
