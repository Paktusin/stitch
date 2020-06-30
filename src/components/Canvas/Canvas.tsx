import React, {FunctionComponent, useContext, useEffect, useRef, useState} from "react";
import './Canvas.scss';
import {Project} from "../../types/project";
import {Cell} from "../../types/cell";
import {StateContext} from "../Store";

export interface CanvasPropsType {
    grid: Cell[][];
    onChange?: (canvas: Project) => void
}

const CELL_SIZE = 4;

export const Canvas: FunctionComponent<CanvasPropsType> = ({grid}) => {
    const {zoom} = useContext(StateContext);
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0});
    const ref = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    function resize() {
        const parent = ref.current.parentElement;
        if (parent) {
            setSize({height: parent.offsetHeight, width: parent.offsetWidth})
        }
    }

    function contextHandler(e: any) {
        e.preventDefault();
    }

    function drawCell(ctx: CanvasRenderingContext2D, stitch: Cell, x: number, y: number) {
        const zoomedSize = zoomed(CELL_SIZE);
        const zX = zoomedX(x);
        const zY = zoomedY(y);
        if (zX > size.width || zY > size.height) {
            console.log('big')
            return;
        }
        const fontSize = zoomedSize / 2;

        ctx.fillStyle = stitch.color;
        ctx.fillRect(zX, zY, zoomedSize, zoomedSize);


        ctx.fillStyle = 'black';
        ctx.shadowBlur = 0;
        ctx.font = `${fontSize}px Arial`;
        // ctx.fillText(stitch.value, zoomedX + (zoomedSize - fontSize) / 2, zoomedY + (zoomedSize + fontSize / 2) / 2)
    }

    function drawCells(ctx: CanvasRenderingContext2D) {
        grid.forEach((cells, rowIndex) => {
            cells.forEach((cell, colIndex) => {
                if (cell) drawCell(ctx, cell, colIndex * CELL_SIZE, rowIndex * CELL_SIZE);
            })
        });
    }

    function drawGrid(ctx: CanvasRenderingContext2D) {
        const cellSize = zoomed(CELL_SIZE);
        const height = Math.min(size.height, grid.length * cellSize);
        const width = Math.min(size.width, grid[0].length * cellSize);
        let i = 0;
        let j = 0;
        const strokeStyle = `rgba(0,0,0,${(zoom.scale - 0.7) / 2})`;
        const strokeStyleBold = `rgba(0,0,0,${zoom.scale / 2})`;
        while (i <= height / cellSize) {
            ctx.lineWidth = zoom.scale - 0.7;
            ctx.lineWidth = i % 5 ? 1 : 2;
            ctx.strokeStyle = i % 5 ? strokeStyle : strokeStyleBold;
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(width, i * cellSize);
            ctx.stroke();
            i++;
        }
        while (j <= width / cellSize) {
            ctx.lineWidth = j % 5 ? 1 : 2;
            ctx.strokeStyle = j % 5 ? strokeStyle : strokeStyleBold;
            ctx.beginPath();
            ctx.moveTo(j * cellSize, 0);
            ctx.lineTo(j * cellSize, height);
            ctx.stroke();
            j++;
        }
    }

    function zoomed(number: number) {
        return Math.floor(number * zoom.scale);
    }

    function zoomedX(number: number) {
        return Math.floor((number) * zoom.scale);
    }

    function zoomedY(number: number) {
        return Math.floor((number) * zoom.scale);
    }

    function drawAll() {
        const ctx = getCtx();
        ctx.clearRect(0, 0, size.width, size.height);
        drawCells(ctx);
        drawGrid(ctx);
    }

    function getCtx(): CanvasRenderingContext2D {
        // @ts-ignore
        return ref.current.getContext('2d');
    }

    useEffect(() => {
        resize();
    }, []);

    useEffect(() => {
        if (grid.length > 0) drawAll();
    }, [grid, size, zoom]);

    useEffect(() => {
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [grid]);

    return (
        <canvas onContextMenu={contextHandler}
                height={size.height}
                width={size.width}
                ref={ref}
                className="Canvas"/>
    )
}
