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
import {Zoom, zoomSettings} from "../../types/zoom";
import {colorService} from "../../services/colorService";
import {Project} from "../../types/project";
import {Scroll} from "../Scroll/Scroll";
import {Child} from "../Child";
import {paths} from "../../types/paths";
import {getStitchImagesData, StitchImages} from "../../services/stitchImages";

export interface CanvasPropsType {
    project: Project;
    onCellClick?: (rowIndex: number, cellIndex: number, direction: Direction, contextMenu: boolean) => void,
    staticZoom?: Zoom
    print?: boolean
}

export const CELL_SIZE = 4;
let mouseButton: any;
let imageMap = new Map<string, HTMLImageElement>();
let wheelTimeOut: any;

export const Canvas: FunctionComponent<CanvasPropsType> = ({
                                                               project,
                                                               onCellClick,
                                                               staticZoom,
                                                               print
                                                           }) => {
    const {zoom: dynamicZoom, view, showSymbols} = useContext(StoreContext);
    const zoom = useMemo(() => staticZoom || dynamicZoom, [staticZoom, dynamicZoom]);

    const {setZoom} = useContext(DispatchContext);
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0});
    const stitchCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const backCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const [images, setImages] = useState<StitchImages>()

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


    function resize() {
        const parent = stitchCanvasRef.current.parentElement;
        if (parent) {
            setSize({height: parent.offsetHeight, width: parent.offsetWidth})
        }
    }

    function emitCell(pageX: number, pageY: number) {
        if (mouseButton === undefined) return;
        const refRect = stitchCanvasRef.current.getBoundingClientRect();
        const cellX = (pageX - refRect.left + zoom.scrollX) / cellSize
        const rowY = (pageY - refRect.top + zoom.scrollY) / cellSize
        const cellIndex = Math.floor(cellX);
        const rowIndex = Math.floor(rowY);
        const direction = (rowY - rowIndex > .5 ? 'b' : 't') + (cellX - cellIndex > .5 ? 'r' : 'l') as Direction;
        if (rowIndex < project.height && cellIndex < project.width) {
            onCellClick && onCellClick(rowIndex, cellIndex, direction, mouseButton === 2);
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
            if (showSymbols) {
                const contrastColor = colorService.strRgbContrast(color);
                const symbolPosArr = paths[stitch.type][stitch.directions.join('')].symbol;
                ctx.fillStyle = color;
                ctx.fill(get2DPath(zX, zY, stitch));
                symbolPosArr.forEach(symbolPos => {
                    drawSymbol(ctx, zX + cellSize * symbolPos[0], zY + cellSize * symbolPos[1], contrastColor, stitch.symbol);
                })
            } else {
                drawStitch(ctx, zX, zY, stitch, color);
            }
        })
    }

    function drawStitch(ctx: CanvasRenderingContext2D, x: number, y: number, stitch: Stitch, color: string) {
        if (!images) return;
        const imgKey = color + stitch.type;
        if (imageMap.has(imgKey)) {
            drawStitchImage(ctx, imageMap.get(imgKey) as HTMLImageElement, x, y, stitch)
        } else {
            const svgEl = images[stitch.type].data.replace(/#fff/g, color);
            const image = new Image();
            image.src = 'data:image/svg+xml;base64,' + btoa(svgEl);
            image.onload = () => {
                imageMap.set(imgKey, image);
                drawStitchImage(ctx, image, x, y, stitch)
            };
        }
    }

    function drawStitchImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, stitch: Stitch) {
        let height = cellSize;
        let width = cellSize;
        if (stitch.type === 'hx') {
            height = cellSize / 2;
            if (stitch.directions.join('') === 'brbl') {
                y = y + cellSize / 2;
            }
        }

        if (stitch.type === 'vx') {
            width = cellSize / 2;
            if (stitch.directions.join('') === 'trbr') {
                x = x + cellSize / 2;
            }
        }
        ctx.drawImage(image, x, y, width, height);
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
        clear(ctx);
        Object.keys(grid).forEach((rowIndex: any) => {
            Object.keys(grid[rowIndex]).forEach((colIndex: any) => {
                const cell = grid[rowIndex][colIndex];
                drawCell(ctx, cell, colIndex, rowIndex);
            })
        })
        if (view === 'grid' || print) drawGrid(ctx);
    }

    function drawBackGround(ctx: CanvasRenderingContext2D) {
        if (print) return;
        clear(ctx);
        ctx.fillStyle = 'white';
        ctx.fillRect(scrolledX(0), scrolledY(0), project.width * cellSize, project.height * cellSize);
        if (view === 'aida' || view === 'count') {
            let i = 0;
            while (i < project.height) {
                let j = 0;
                while (j < project.width) {
                    ctx.drawImage(view === 'aida' ? aidaImgEl : counterImgEl,
                        0, 0,
                        24, 24,
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
        drawPicture(ctx);
    }

    function clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, size.width, size.height);
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
        const stitchCtx = stitchCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
        const backCtx = backCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
        drawBackGround(backCtx);
        drawCells(stitchCtx);
    }

    function wheel(e: React.WheelEvent<HTMLCanvasElement>) {
        if (staticZoom) return;
        clearTimeout(wheelTimeOut);
        const {shiftKey, altKey, deltaY} = e;
        wheelTimeOut = setTimeout(() => {
            const delta = deltaY < 0 ? -150 : 150;
            if (altKey) {
                const {scale} = zoom;
                const newScale = (delta < 0 ? Math.min(zoomSettings.max, scale * zoomSettings.speed) : Math.max(zoomSettings.min, scale * (1 / zoomSettings.speed)));
                if (newScale !== scale) {
                    setZoom({
                        ...zoom,
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
        getStitchImagesData().then(data => {
            setImages(data);
            resize();
        })
    }, []);

    useEffect(() => {
        drawAll();
    }, [project, size, zoom, view, showSymbols]);

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
            {!staticZoom && <Scroll scroll={zoom.scrollY} onScroll={e => scrollHandler(false, e)}
                                    size={cellSize * project.height - size.height}/>}
            <div className="scrollContainer">
                <div className="canvasContainer">
                    <canvas height={size.height}
                            width={size.width}
                            ref={backCanvasRef}
                            className="Canvas"/>
                    <canvas onWheel={wheel}
                            onContextMenu={e => e.preventDefault()}
                            onMouseMove={mouseMoveHandler}
                            onMouseDown={mouseDownHandler}
                            onMouseUp={mouseDownHandler}
                            height={size.height}
                            width={size.width}
                            ref={stitchCanvasRef}
                            className="Canvas"/>

                </div>
                {!staticZoom && <Scroll scroll={zoom.scrollX} onScroll={e => scrollHandler(true, e)}
                                        size={cellSize * project.width - size.width}
                                        horizontal={true}/>}
            </div>
        </Child>
    )
}
