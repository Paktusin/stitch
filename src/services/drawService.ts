import {Stitch} from '../types/stitch';
import {CanvasType} from '../types/canvas';
import {ZoomType} from "../types/zoom";

const STITCH_SIZE = 8;

export const drawService = {
    drawStitch(ctx: CanvasRenderingContext2D, stitch: Stitch, x: number, y: number, zoom: ZoomType) {
        const zoomedSize = this.zoomed(STITCH_SIZE, zoom);
        const zoomedX = this.zoomedX(x, zoom)
        const zoomedY = this.zoomedY(y, zoom)
        const fontSize = zoomedSize / 2;

        ctx.fillStyle = stitch.color;
        ctx.shadowBlur = 6
        ctx.shadowColor = "#666";
        ctx.fillRect(zoomedX, zoomedY, zoomedSize, zoomedSize);


        ctx.fillStyle = 'black';
        ctx.shadowBlur = 0;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(stitch.value, zoomedX + (zoomedSize - fontSize) / 2, zoomedY + (zoomedSize + fontSize / 2) / 2)
    },

    drawGrid(ctx: CanvasRenderingContext2D, canvasData: CanvasType) {
        const {stitches, zoom} = canvasData;
        stitches.forEach((stitchArray, rowIndex) => {
            stitchArray.forEach((stitch, colIndex) => {
                this.drawStitch(ctx, stitch, colIndex * STITCH_SIZE, rowIndex * STITCH_SIZE, zoom);
            })
        });
    },

    drawGridDall(ctx: CanvasRenderingContext2D, canvasData: CanvasType) {
        const {zoom} = canvasData;
        const zoomedWidth = this.zoomed(canvasData.stitches[0].length * STITCH_SIZE, canvasData.zoom);
        const zoomedHeight = this.zoomed(canvasData.stitches.length * STITCH_SIZE, canvasData.zoom);
        ctx.fillStyle = '#eee';
        ctx.fillRect(this.zoomedX(0, zoom), this.zoomedY(0, zoom), zoomedWidth, zoomedHeight)
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
