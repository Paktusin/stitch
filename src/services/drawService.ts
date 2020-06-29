import {Cell} from '../types/cell';
import {ZoomType} from "../types/zoom";

const CELL_SIZE = 8;

export class DrawService {
    drawCell(ctx: CanvasRenderingContext2D, stitch: Cell, x: number, y: number, zoom: ZoomType) {
        const zoomedSize = this.zoomed(CELL_SIZE, zoom);
        const zoomedX = this.zoomedX(x, zoom);
        const zoomedY = this.zoomedY(y, zoom);
        const fontSize = zoomedSize / 2;

        ctx.fillStyle = stitch.color;
        // ctx.shadowBlur = 3 * zoom.scale
        // ctx.shadowColor = "#666";
        ctx.fillRect(zoomedX, zoomedY, zoomedSize, zoomedSize);


        ctx.fillStyle = 'black';
        ctx.shadowBlur = 0;
        ctx.font = `${fontSize}px Arial`;
        // ctx.fillText(stitch.value, zoomedX + (zoomedSize - fontSize) / 2, zoomedY + (zoomedSize + fontSize / 2) / 2)
    }

    drawCells(ctx: CanvasRenderingContext2D, grid: Cell[][], zoom: ZoomType) {
        grid.forEach((cells, rowIndex) => {
            cells.forEach((cell, colIndex) => {
                if (cell)
                    this.drawCell(ctx, cell, colIndex * CELL_SIZE, rowIndex * CELL_SIZE, zoom);
            })
        });
    }

    drawGrid(ctx: CanvasRenderingContext2D, zoom: ZoomType, size: { height: number, width: number }) {
        const cellSize = this.zoomed(CELL_SIZE, zoom);
        let i = 0;
        let j = 0;
        ctx.strokeStyle = `rgba(0,0,0,${zoom.scale/3})`;

        while (i <= size.height / cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(size.width, i * cellSize);
            ctx.stroke();
            i++;
        }

        while (j <= size.width / cellSize) {
            ctx.beginPath();
            ctx.moveTo(j * cellSize, 0);
            ctx.lineTo(j * cellSize, size.height);
            ctx.stroke();
            j++;
        }
    }

    zoomed(number: number, zoom: ZoomType) {
        return Math.floor(number * zoom.scale);
    }

    zoomedX(number: number, zoom: ZoomType) {
        return Math.floor((number) * zoom.scale);
    }

    zoomedY(number: number, zoom: ZoomType) {
        return Math.floor((number) * zoom.scale);
    }

    drawAll(ctx: CanvasRenderingContext2D | null, grid: Cell[][], zoom: ZoomType, size: { height: number, width: number }) {
        if (!ctx) return;
        ctx.clearRect(0, 0, size.width, size.height);
        this.drawCells(ctx, grid, zoom);
        this.drawGrid(ctx, zoom, size);
    }
}

export const drawService = new DrawService()
