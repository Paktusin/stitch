import React, {FunctionComponent, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import './Canvas.scss';
import {Cell} from "../../types/cell";
import {DispatchContext, StoreContext, StoreType} from "../Store";
import {Direction} from "../../types/stitch";
import {zoomSettings} from "../../types/zoom";
import {colorService} from "../../services/colorService";
import {Project} from "../../types/project";
import {Scroll} from "../Scroll/Scroll";
import {Child} from "../Child";

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
    const {setZoom} = useContext(DispatchContext);
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0});
    const ref = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    const zoomed = useCallback((number: number) => Math.floor(number * zoom.scale), [zoom.scale]);
    const scrolledX = useCallback((number: number) => Math.floor(number - zoom.scrollX), [zoom.scrollX]);
    const scrolledY = useCallback((number: number) => Math.floor(number - zoom.scrollY), [zoom.scrollY]);

    const cellSize = useMemo(() => zoomed(CELL_SIZE), [zoomed]);
    const renderHeight = useMemo(() => Math.min(size.height, project.height * cellSize), [size, project.height, cellSize]);
    const renderWidth = useMemo(() => Math.min(size.width, project.width * cellSize), [size, project.width, cellSize]);
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
        const zX = scrolledX(cellIndex * cellSize);
        const zY = scrolledY(rowIndex * cellSize);
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
        ctx.fillRect(scrolledX(0), scrolledY(0), project.width * cellSize, project.height * cellSize);

        if (view === 'aida' || view === 'count') {
            let i = 0;
            while (i <= project.height) {
                let j = 0;
                while (j <= project.width) {
                    ctx.drawImage(view === 'aida' ? aidaImgEl : counterImgEl,
                        scrolledX(j * cellSize),
                        scrolledY(i * cellSize),
                        cellSize,
                        cellSize)
                    j++;
                }
                i++;
            }
        }
    }

    function drawGrid(ctx: CanvasRenderingContext2D) {
        const gridSize = 10;
        let i = 0;
        let j = 0;
        const strokeStyle = `rgba(0,0,0,${(zoom.scale - zoomSettings.min) / 2})`;
        const strokeStyleBold = `rgba(0,0,0,${zoom.scale / 2})`;
        while (i <= project.height) {
            ctx.lineWidth = zoom.scale - zoomSettings.min;
            ctx.lineWidth = i % gridSize ? 1 : 2;
            ctx.strokeStyle = i % gridSize ? strokeStyle : strokeStyleBold;
            ctx.beginPath();
            ctx.moveTo(scrolledX(0), scrolledY(i * cellSize));
            ctx.lineTo(scrolledX(project.width * cellSize), scrolledY(i * cellSize));
            ctx.stroke();
            i++;
        }
        while (j <= project.width) {
            ctx.lineWidth = j % gridSize ? 1 : 2;
            ctx.strokeStyle = j % gridSize ? strokeStyle : strokeStyleBold;
            ctx.beginPath();
            ctx.moveTo(scrolledX(j * cellSize), scrolledY(0));
            ctx.lineTo(scrolledX(j * cellSize), scrolledY(project.height * cellSize));
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

    function wheel(e: WheelEvent) {
        if (e.altKey) {
            const {scale} = zoom;
            const newScale = (e.deltaY < 0 ? Math.min(zoomSettings.max, scale * zoomSettings.speed) : Math.max(zoomSettings.min, scale * (1 / zoomSettings.speed)));
            if (newScale !== scale) {
                setZoom({
                    scrollX: 0,
                    scrollY: 0,
                    scale: newScale,
                });
            }
        } else {
            if (project) {
                if (e.shiftKey) {
                    const maxScrollX = project.width * cellSize - size.width;
                    const newScrollX = zoom.scrollX + e.deltaY;
                    setZoom({
                        ...zoom,
                        scrollX: 0 > newScrollX ? 0 : newScrollX >= maxScrollX ? maxScrollX : newScrollX
                    })
                } else {
                    const maxScrollY = project.height * cellSize - size.height;
                    const newScrollY = zoom.scrollY + e.deltaY;
                    setZoom({
                        ...zoom,
                        scrollY: 0 > newScrollY ? 0 : newScrollY >= maxScrollY ? maxScrollY : newScrollY
                    })
                }

            }
        }
    }

    function scrollHandler(x = true, event: React.UIEvent<HTMLDivElement>) {
        const scroll = event.currentTarget[x ? 'scrollLeft' : 'scrollTop'];
        setZoom({...zoom, [x ? 'scrollX' : 'scrollY']: scroll});
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

    useEffect(() => {
        ref.current.addEventListener('wheel', wheel);
        return () => {
            ref.current.removeEventListener('wheel', wheel);
        }
    }, [zoom, project]);


    return (
        <Child>
            <Scroll scroll={zoom.scrollY} onScroll={e => scrollHandler(false, e)}
                    size={cellSize * project.height - size.height}/>
            <div className="canvasContainer">
                <div style={{display: 'flex', flex: '1 auto'}}>
                    <canvas onContextMenu={e => clickHandler(e, true)}
                            onClick={clickHandler}
                            height={size.height}
                            width={size.width}
                            ref={ref}
                            className="Canvas"/>
                </div>
                <Scroll scroll={zoom.scrollX} onScroll={e => scrollHandler(true, e)}
                        size={cellSize * project.width - size.width}
                        horizontal={true}/>
            </div>
        </Child>
    )
}
