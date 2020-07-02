import React, {FunctionComponent, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import './Canvas.scss';
import {Cell} from "../../types/cell";
import {StoreContext, StoreType} from "../Store";
import {Direction} from "../../types/stitch";
import {zoomSettings} from "../../types/zoom";
import {colorService} from "../../services/colorService";
import {Project} from "../../types/project";

export interface CanvasPropsType {
    project: Project;
    onCellClick?: (rowIndex: number, cellIndex: number, direction: Direction, contextMenu: boolean) => void
}

const CELL_SIZE = 4;

export const Canvas: FunctionComponent<CanvasPropsType> = ({
                                                               project,
                                                               onCellClick
                                                           }) => {
    const {zoom, view} = useContext(StoreContext);
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0});
    const ref = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    const zoomed = useCallback((number: number) => Math.floor(number * zoom.scale), [zoom.scale]);
    // const scrollX = useCallback((number: number) => Math.floor(number * zoom.scale), [zoom.scale]);

    const cellSize = useMemo(() => zoomed(CELL_SIZE), [zoomed]);
    const height = useMemo(() => Math.min(size.height, project.height * cellSize), [size, project.height, cellSize]);
    const width = useMemo(() => Math.min(size.width, project.width * cellSize), [size, project.height, cellSize]);
    const {grid, palette} = project;

    const aidaImgEl = document.querySelector('#aida') as HTMLImageElement;
    const counterImgEl = document.querySelector('#counter') as HTMLImageElement;

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
        if (rowIndex <= project.height && cellIndex <= project.width) {
            onCellClick && onCellClick(rowIndex, cellIndex, direction, contextMenu)
        }
    }

    function drawCell(ctx: CanvasRenderingContext2D, cell: Cell, cellIndex: number, rowIndex: number) {
        const zX = cellIndex * cellSize;
        const zY = rowIndex * cellSize;
        const color = palette[cell.symbol].color;
        if (zX > size.width || zY > size.height) {
            return;
        }
        const fontSize = cellSize / 1.5;

        ctx.fillStyle = color;
        ctx.fillRect(zX, zY, cellSize, cellSize);

        ctx.fillStyle = colorService.strRgbContrast(color);
        ctx.shadowBlur = 0;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(cell.symbol, zX + (cellSize - fontSize / 1.5) / 2, zY + (cellSize + fontSize / 1.5) / 2)
    }

    function drawCells(ctx: CanvasRenderingContext2D) {
        Object.keys(grid).forEach((rowIndex: any) => {
            Object.keys(grid[rowIndex]).forEach((colIndex: any) => {
                const cell = grid[rowIndex][colIndex];
                drawCell(ctx, cell, colIndex, rowIndex);
            })
        })
    }

    function drawBackGround(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        if (view === 'aida' || view === 'count') {
            let i = 0;
            while (i <= height / cellSize) {
                let j = 0;
                while (j <= width / cellSize) {
                    ctx.drawImage(view === 'aida' ? aidaImgEl : counterImgEl,
                        j * cellSize,
                        i * cellSize,
                        cellSize,
                        cellSize)
                    j++;
                }
                i++;
            }
        }
    }

    function drawGrid(ctx: CanvasRenderingContext2D) {
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
        drawBackGround(ctx);
        drawCells(ctx);
        if (view === 'grid') drawGrid(ctx);
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
    }, [grid, size, zoom, view]);

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
