import React, {FunctionComponent, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import './Canvas.scss';
import {Cell} from "../../types/cell";
import {StateContext} from "../Store";
import {Direction} from "../../types/stitch";
import {zoomSettings} from "../../types/zoom";
import {colorService} from "../../services/colorService";

export interface CanvasPropsType {
    grid: (Cell | undefined)[][];
    onCellClick?: (rowIndex: number, cellIndex: number, direction: Direction, contextMenu: boolean) => void
}

const CELL_SIZE = 4;

export const Canvas: FunctionComponent<CanvasPropsType> = ({grid, onCellClick}) => {
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
        if (rowIndex <= grid.length && grid.length > 1 && cellIndex <= grid[0].length) {
            onCellClick && onCellClick(rowIndex, cellIndex, direction, contextMenu)
        }
    }

    function drawCell(ctx: CanvasRenderingContext2D, stitch: Cell, x: number, y: number) {
        const zX = zoomed(x);
        const zY = zoomed(y);
        if (zX > size.width || zY > size.height) {
            return;
        }
        const fontSize = cellSize / 2;

        ctx.fillStyle = stitch.thread.color;
        ctx.fillRect(zX, zY, cellSize, cellSize);


        ctx.fillStyle = colorService.strRgbContrast(stitch.thread.color);
        ctx.shadowBlur = 0;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(stitch.symbol, zX + (cellSize - fontSize) / 2, zY + (cellSize + fontSize / 2) / 2)
    }

    function drawCells(ctx: CanvasRenderingContext2D) {
        grid.forEach((cells, rowIndex) => {
            cells.forEach((cell, colIndex) => {
                if (cell) drawCell(ctx, cell, colIndex * CELL_SIZE, rowIndex * CELL_SIZE);
            })
        });
    }

    function drawGrid(ctx: CanvasRenderingContext2D) {
        const height = grid.length * cellSize;
        const width = grid[0].length * cellSize;
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
        if (grid.length > 0) drawAll();
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
