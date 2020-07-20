import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import './Canvas.scss';
import {Cell} from "../../types/cell";
import {DispatchContext, StoreContext, StoreType} from "../Store";
import {Direction, Stitch, StitchType} from "../../types/stitch";
import {zoomSettings} from "../../types/zoom";
import {colorService} from "../../services/colorService";
import {Project} from "../../types/project";
import {Scroll} from "../Scroll/Scroll";
import {Child} from "../Child";
import {paths} from "../../types/paths";

export interface CanvasPropsType {
    project: Project;
    onCellClick?: (rowIndex: number, cellIndex: number, direction: Direction, contextMenu: boolean) => void
}

export const CELL_SIZE = 4;
let mouseButton: any;
let lastCell: any;

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
    const fontSize = cellSize / 2;
    const {grid, palette} = project;

    const aidaImgEl = document.querySelector('#aida') as HTMLImageElement;
    const counterImgEl = document.querySelector('#counter') as HTMLImageElement;
    const image = useMemo(() => {
        if (project.picture && project.picture.data) {
            const image = new Image();
            image.src = project.picture.data;
            return image;
        }
        return null;
    }, [project.picture])

    let wheelTimeOut: any;

    function resize() {
        const parent = ref.current.parentElement;
        if (parent) {
            setSize({height: parent.offsetHeight, width: parent.offsetWidth})
        }
    }

    function emitCell(pageX: number, pageY: number) {
        if (mouseButton === undefined) return;
        const refRect = ref.current.getBoundingClientRect();
        const cellX = (pageX - refRect.left + zoom.scrollX) / cellSize
        const rowY = (pageY - refRect.top + zoom.scrollY) / cellSize
        const cellIndex = Math.floor(cellX);
        const rowIndex = Math.floor(rowY);
        if (lastCell !== `${cellIndex}-${rowIndex}-${mouseButton}`) {
            const direction = (rowY - rowIndex > .5 ? 'b' : 't') + (cellX - cellIndex > .5 ? 'r' : 'l') as Direction;
            if (rowIndex <= project.height && cellIndex <= project.width) {
                lastCell = `${cellIndex}-${rowIndex}-${mouseButton}`
                onCellClick && onCellClick(rowIndex, cellIndex, direction, mouseButton === 2);
            }
        }
    }

    function drawCell(ctx: CanvasRenderingContext2D, cell: Cell, cellIndex: number, rowIndex: number) {
        const zX = scrolledX(cellIndex * cellSize);
        const zY = scrolledY(rowIndex * cellSize);
        if (zX > size.width || zY > size.height) {
            return;
        }
        cell.forEach(stitch => {
            const color = palette[stitch.symbol].color;
            const contrastColor = colorService.strRgbContrast(color);
            ctx.fillStyle = color;
            ctx.fill(get2DPath(zX, zY, stitch));
            const symbolPosArr = paths[stitch.type][stitch.directions.join('')].symbol;
            symbolPosArr.forEach(symbolPos => {
                drawSymbol(ctx, zX + cellSize * symbolPos[0], zY + cellSize * symbolPos[1], contrastColor, stitch.symbol);
            })
        })
    }

    function drawSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, symbol: string) {
        ctx.fillStyle = color;
        ctx.shadowBlur = 0;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center"
        ctx.fillText(symbol, x, y)
    }

    function get2DPath(x: number, y: number, stitch: Stitch) {
        const arrPath = paths[stitch.type][stitch.directions.join('')].path;
        const str = [...arrPath, arrPath[0]].map((el, index) => {
            return `${index === 0 ? 'm' : 'L'}${x + el[0] * cellSize},${y + el[1] * cellSize}`;
        }).join('') + 'z';
        return new Path2D(str);
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
            while (i < project.height) {
                let j = 0;
                while (j < project.width) {
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
        ctx.fillStyle = `${project.color}88`;
        ctx.fillRect(scrolledX(0), scrolledY(0), project.width * cellSize, project.height * cellSize);
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

    function drawPicture(ctx: CanvasRenderingContext2D) {
        const {picture} = project;
        if (image && picture) {
            ctx.globalAlpha = picture.opacity;
            ctx.drawImage(
                image,
                scrolledX(picture.left * cellSize),
                scrolledY(picture.top * cellSize),
                picture.sWidth * cellSize,
                picture.sHeight * cellSize
            );
            ctx.globalAlpha = 1;
        }
    }

    function drawAll() {
        const ctx = getCtx();
        ctx.clearRect(0, 0, size.width, size.height);
        drawBackGround(ctx);
        drawPicture(ctx);
        drawCells(ctx);
        if (view === 'grid') drawGrid(ctx);
    }

    function getCtx(): CanvasRenderingContext2D {
        // @ts-ignore
        return ref.current.getContext('2d');
    }

    function wheel(e: React.WheelEvent<HTMLCanvasElement>) {
        clearTimeout(wheelTimeOut);
        const {shiftKey, altKey, deltaY} = e;
        wheelTimeOut = setTimeout(() => {
            const delta = deltaY < 0 ? -150 : 150;
            if (altKey) {
                const {scale} = zoom;
                const newScale = (delta < 0 ? Math.min(zoomSettings.max, scale * zoomSettings.speed) : Math.max(zoomSettings.min, scale * (1 / zoomSettings.speed)));
                if (newScale !== scale) {
                    setZoom({
                        scrollX: 0,
                        scrollY: 0,
                        scale: newScale,
                    });
                }
            } else {
                if (project) {
                    if (shiftKey) {
                        if (project.width * cellSize > size.width) {
                            const maxScrollX = project.width * cellSize - size.width;
                            const newScrollX = zoom.scrollX + delta;
                            setZoom({
                                ...zoom,
                                scrollX: 0 > newScrollX ? 0 : newScrollX >= maxScrollX ? maxScrollX : newScrollX
                            })
                        }
                    } else {
                        if (project.height * cellSize > size.height) {
                            const maxScrollY = project.height * cellSize - size.height;
                            const newScrollY = zoom.scrollY + delta;
                            setZoom({
                                ...zoom,
                                scrollY: 0 > newScrollY ? 0 : newScrollY >= maxScrollY ? maxScrollY : newScrollY
                            })
                        }
                    }

                }
            }
        }, 30)
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
    }, [project, size, zoom, view]);

    useEffect(() => {
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [project]);

    function mouseDownHandler(event: React.MouseEvent) {
        event.preventDefault();
        if (event.type === 'mousedown') {
            mouseButton = event.button;
            emitCell(event.pageX, event.pageY);
        } else {
            mouseButton = undefined;
        }
    }

    function mouseMoveHandler(event: React.MouseEvent) {
        emitCell(event.pageX, event.pageY);
    }

    return (
        <Child>
            <Scroll scroll={zoom.scrollY} onScroll={e => scrollHandler(false, e)}
                    size={cellSize * project.height - size.height}/>
            <div className="scrollContainer">
                <div className="canvasContainer">
                    <canvas onWheel={wheel}
                            onContextMenu={e => e.preventDefault()}
                            onMouseMove={mouseMoveHandler}
                            onMouseDown={mouseDownHandler}
                            onMouseUp={mouseDownHandler}
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
