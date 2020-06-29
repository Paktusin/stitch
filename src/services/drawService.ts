import {Cell} from '../types/cell';
import {Project} from '../types/project';
import {ZoomType} from "../types/zoom";

const STITCH_SIZE = 8;

export const drawService = {
    drawCell(ctx: CanvasRenderingContext2D, stitch: Cell, x: number, y: number, zoom: ZoomType) {
        const zoomedSize = this.zoomed(STITCH_SIZE, zoom);
        const zoomedX = this.zoomedX(x, zoom)
        const zoomedY = this.zoomedY(y, zoom)
        const fontSize = zoomedSize / 2;

        ctx.fillStyle = stitch.color || 'white';
        ctx.shadowBlur = 3 * zoom.scale
        ctx.shadowColor = "#666";
        ctx.fillRect(zoomedX, zoomedY, zoomedSize, zoomedSize);


        ctx.fillStyle = 'black';
        ctx.shadowBlur = 0;
        ctx.font = `${fontSize}px Arial`;
        // ctx.fillText(stitch.value, zoomedX + (zoomedSize - fontSize) / 2, zoomedY + (zoomedSize + fontSize / 2) / 2)
    },

    drawGrid(ctx: CanvasRenderingContext2D, canvasData: Project, zoom: ZoomType) {
        const {grid} = canvasData;
        grid.forEach((stitchArray, rowIndex) => {
            stitchArray.forEach((stitch, colIndex) => {
                this.drawCell(ctx, stitch, colIndex * STITCH_SIZE, rowIndex * STITCH_SIZE, zoom);
            })
        });
    },

    zoomed(number: number, zoom: ZoomType) {
        return Math.floor(number * zoom.scale);
    },

    zoomedX(number: number, zoom: ZoomType) {
        return Math.floor((number) * zoom.scale);
    },

    zoomedY(number: number, zoom: ZoomType) {
        return Math.floor((number) * zoom.scale);
    }
}
