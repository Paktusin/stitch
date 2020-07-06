import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState, WheelEvent,
    WheelEventHandler
} from "react";
import './Canvas.scss';
import {Cell} from "../../types/cell";
import {DispatchContext, StoreContext, StoreType} from "../Store";
import {Direction, StitchType} from "../../types/stitch";
import {zoomSettings} from "../../types/zoom";
import {colorService} from "../../services/colorService";
import {Project} from "../../types/project";
import {Scroll} from "../Scroll/Scroll";
import {Child} from "../Child";

export interface CanvasPropsType {
    project: Project;
    onCellClick?: (rowIndex: number, cellIndex: number, direction: Direction, contextMenu: boolean) => void
}

export const CELL_SIZE = 4;

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
    const fontSize = cellSize / 1.5;
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

    function clickHandler(event: React.MouseEvent<HTMLCanvasElement>, contextMenu = false) {
        event.preventDefault();
        const refRect = ref.current.getBoundingClientRect();
        const cellX = (event.pageX - refRect.left + zoom.scrollX) / cellSize
        const rowY = (event.pageY - refRect.top + zoom.scrollY) / cellSize
        const cellIndex = Math.floor(cellX);
        const rowIndex = Math.floor(rowY);
        const direction = (rowY - rowIndex > .5 ? 'b' : 't') + (cellX - cellIndex > .5 ? 'r' : 'l') as Direction;
        if (rowIndex <= project.height && cellIndex <= project.width) {
            onCellClick && onCellClick(rowIndex, cellIndex, direction, contextMenu)
        }
    }

    function drawCell(ctx: CanvasRenderingContext2D, cell: Cell, cellIndex: number, rowIndex: number) {
        let zX = scrolledX(cellIndex * cellSize);
        let zY = scrolledY(rowIndex * cellSize);
        let cellHeight = cellSize, cellWidth = cellSize;
        let fontX = zX + cellWidth / 3;
        let fontY = zY + cellWidth / 1.5;
        const color = palette[cell.symbol].color;
        if (zX > size.width || zY > size.height) {
            return;
        }
        const contrastColor = colorService.strRgbContrast(color);
        const directions = cell.stitch.direction.split('');
        ctx.fillStyle = color;
        if (['qx', '3qx'].indexOf(cell.stitch.type) !== -1) {
            drawQx(ctx, zX, zY, cell);
            if (cell.stitch.type === '3qx') {
                fontX = zX + cellWidth / 2;
                fontY = zY + cellHeight / 1.2;
            } else {
                fontX = zX;
                fontY = zY + cellHeight / 3;
            }
            drawSymbol(ctx, fontX, fontY, contrastColor, cell.symbol, fontSize / 1.3);
        } else {
            directions.forEach(direction => {
                switch (direction) {
                    case "t":
                        cellHeight /= 2;
                        fontY = zY + cellHeight / 2 + fontSize / 4;
                        break;
                    case "b":
                        zY += cellWidth / 2;
                        cellHeight /= 2;
                        fontY = zY + cellHeight / 2 + fontSize / 4;
                        break;
                    case "l":
                        cellWidth /= 2;
                        fontX = zX;
                        break;
                    case "r":
                        zX += cellWidth / 2;
                        fontX = zX;
                        cellWidth /= 2;
                        break;
                }
            })
            ctx.fillRect(zX, zY, cellWidth, cellHeight);
            drawSymbol(ctx, fontX, fontY, contrastColor, cell.symbol);
        }
    }

    function drawSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, symbol: string, fS = fontSize) {
        ctx.fillStyle = color;
        ctx.shadowBlur = 0;
        ctx.font = `${fS}px Arial`;
        ctx.fillText(symbol, x, y)
    }

    function drawQx(ctx: CanvasRenderingContext2D, x: number, y: number, cell: Cell) {
        ctx.beginPath();
        if (cell.stitch.type === '3qx') {
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x, y + cellSize * 0.75);
            ctx.lineTo(x + cellSize * 0.75, y);
            ctx.lineTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.lineTo(x, y + cellSize);
        } else {
            ctx.moveTo(x, y + cellSize * 0.75);
            ctx.lineTo(x, y);
            ctx.lineTo(x + cellSize * 0.75, y);
            ctx.lineTo(x, y + cellSize * 0.75);
        }
        ctx.fill();
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


    return (
        <Child>
            <Scroll scroll={zoom.scrollY} onScroll={e => scrollHandler(false, e)}
                    size={cellSize * project.height - size.height}/>
            <div className="scrollContainer">
                <div className="canvasContainer">
                    <canvas onWheel={wheel} onContextMenu={e => clickHandler(e, true)}
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
