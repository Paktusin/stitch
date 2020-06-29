import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import './Canvas.scss';
import {Project} from "../../types/project";
import {drawService} from "../../services/drawService";
import {ZoomType} from "../../types/zoom";
import {Cell} from "../../types/cell";

export interface CanvasPropsType {
    grid: Cell[][];
    zoom: ZoomType;
    onChange?: (canvas: Project) => void
}

export const Canvas: FunctionComponent<CanvasPropsType> = ({grid, zoom}) => {

    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0});

    function resize() {
        const parent = canvasRef.current.parentElement;
        if (parent) {
            setSize({height: parent.offsetHeight, width: parent.offsetWidth})
        }
        draw();
    }

    function draw() {
        window.requestAnimationFrame(() => {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, size.width, size.height);
                drawService.drawGrid(ctx, grid, zoom);
            }
        })
    }

    function contextHandler(e: any) {
        e.preventDefault();
    }

    useEffect(() => {
        resize();
    }, []);

    useEffect(() => {
        draw();
    }, [grid, zoom]);

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
                ref={canvasRef}
                className="Canvas"/>
    )
}
