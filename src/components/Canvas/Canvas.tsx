import React, {FunctionComponent, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import './Canvas.scss';
import {Cell} from "../../types/cell";
import {StateContext} from "../Store";
import {Direction} from "../../types/stitch";
import {zoomSettings} from "../../types/zoom";
import {colorService} from "../../services/colorService";
import {GridType} from "../../types/project";

export interface CanvasPropsType {
    grid: GridType;
    gridHeight: number;
    gridWidth: number;
    onCellClick?: (rowIndex: number, cellIndex: number, direction: Direction, contextMenu: boolean) => void
}

const CELL_SIZE = 4;

export const Canvas: FunctionComponent<CanvasPropsType> = ({
                                                               gridHeight,
                                                               gridWidth,
                                                               grid,
                                                               onCellClick
                                                           }) => {
    const {zoom} = useContext(StateContext);
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0});
    const ref = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const zoomed = useCallback((number: number) => Math.floor(number * zoom.scale), [zoom.scale])
    const cellSize = useMemo(() => zoomed(CELL_SIZE), [zoomed]);

    function resize() {
        const parent = ref.current.parentElement;
        if (parent) {
            setSize({height: parent.offsetHeight, width: parent.offsetWidth})
        }
    }

    function clickHandler(event: React.MouseEvent<HTMLCanvasElement>, contextMenu = false) {
        event.preventDefault();
        const refRect = ref.current.getBoundingClientRect();
        const cellX = (event.pageX - refRect.left) / cellSize
        const rowY = (event.pageY - refRect.top) / cellSize
        const cellIndex = Math.floor(cellX);
        const rowIndex = Math.floor(rowY);
        const direction = (rowY - rowIndex > .5 ? 'b' : 't') + (cellX - cellIndex > .5 ? 'r' : 'l') as Direction;
        if (rowIndex <= gridHeight && cellIndex <= gridWidth) {
            onCellClick && onCellClick(rowIndex, cellIndex, direction, contextMenu)
        }
    }

    function drawCell(ctx: CanvasRenderingContext2D, stitch: Cell, cellIndex: number, rowIndex: number) {
        const zX = cellIndex * cellSize;
        const zY = rowIndex * cellSize;
        if (zX > size.width || zY > size.height) {
            return;
        }
        const fontSize = cellSize / 1.5;

        ctx.fillStyle = stitch.thread.color;
        ctx.fillRect(zX, zY, cellSize, cellSize);

        ctx.fillStyle = colorService.strRgbContrast(stitch.thread.color);
        ctx.shadowBlur = 0;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(stitch.symbol, zX + (cellSize - fontSize / 2) / 2, zY + (cellSize + fontSize / 2) / 2)
    }

    function drawCells(ctx: CanvasRenderingContext2D) {
        Object.keys(grid).forEach((rowIndex: any) => {
            Object.keys(grid[rowIndex]).forEach((colIndex: any) => {
                const cell = grid[rowIndex][colIndex];
                drawCell(ctx, cell, colIndex, rowIndex);
            })
        })
    }

    function drawGrid(ctx: CanvasRenderingContext2D) {
        const height = Math.min(size.height, gridHeight * cellSize);
        const width = Math.min(size.width, gridWidth * cellSize);
        let i = 0;
        let j = 0;
        const strokeStyle = `rgba(0,0,0,${(zoom.scale - zoomSettings.min) / 2})`;
        const strokeStyleBold = `rgba(0,0,0,${zoom.scale / 2})`;
        while (i <= height / cellSize) {
            ctx.lineWidth = zoom.scale - zoomSettings.min;
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
        drawAll();
    }, [grid, size, zoom]);

    useEffect(() => {
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [grid]);

    return (
        <canvas onContextMenu={e => clickHandler(e, true)}
                onClick={clickHandler}
                height={size.height}
                width={size.width}
                ref={ref}
                className="Canvas"/>
    )
}
