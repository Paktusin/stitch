import React, {FunctionComponent, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState} from "react";
import './Canvas.scss';
import {CanvasType} from "../../types/canvas";
import {drawService} from "../../services/drawService";

export interface CanvasPropsType {
    canvasData: CanvasType;
    onChange?: (canvas: CanvasType) => void
}

export const Canvas: FunctionComponent<CanvasPropsType> =({canvasData, onChange}) => {
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0});
    const [drag, setDrag] = useState(false);
    const [mousePos, setMousePos] = useState<{ x: number, y: number }>({x: 0, y: 0})

    function resize() {
        const parent = canvasRef.current.parentElement;
        if (parent) {
            setSize({height: parent.offsetHeight, width: parent.offsetWidth})
        }
        draw();
    }

    function zoomedX_INV(number: number) {
        const {sx, scale, wx} = canvasData.zoom;
        return Math.floor((number - sx) * (1 / scale) + wx);
    }

    function zoomedY_INV(number: number) {
        const {sy, scale, wy} = canvasData.zoom;
        return Math.floor((number - sy) * (1 / scale) + wy);
    }

    // @ts-ignore
    function wheel(e: WheelEvent<HTMLCanvasElement>) {
        const zoomSpeed = 1.3;
        const {scale} = canvasData.zoom;
        const newScale = e.deltaY < 0 ? Math.min(5, scale * zoomSpeed) : Math.max(0.7, scale * (1 / zoomSpeed))
        if (newScale !== scale) {
            onChange && onChange({
                ...canvasData,
                zoom: {
                    scale: newScale,
                    wx: zoomedX_INV(e.x),
                    wy: zoomedY_INV(e.y),
                    sx: e.x,
                    sy: e.y,
                }
            });
        }
        draw();
    }

    function draw() {
        window.requestAnimationFrame(() => {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, size.width, size.height);
                if (!drag) {
                    drawService.drawGrid(ctx, canvasData);
                } else {
                    drawService.drawGridDall(ctx, canvasData);
                }
            }
        })
    }

    function contextHandler(e: any) {
        e.preventDefault();
    }

    function move(event: MouseEvent) {
        const bounds = canvasRef.current.getBoundingClientRect();
        const newMouseX = zoomedX_INV(event.clientX - bounds.left); // get the mouse real world pos via inverse scale and translate
        const newMouseY = zoomedY_INV(event.clientY - bounds.top);
        if (drag) {
            onChange && onChange({
                ...canvasData,
                zoom: {
                    ...canvasData.zoom,
                    wx: canvasData.zoom.wx - (newMouseX - mousePos.x),
                    wy: canvasData.zoom.wy - (newMouseY - mousePos.y),
                }
            })
        }
        setMousePos({x: newMouseX, y: newMouseY})
    }

    function mouseDownHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (e.altKey) {
            setDrag(true);
        }
    }

    useEffect(()=>{
        resize();
    },[])

    useEffect(() => {
        canvasRef.current.addEventListener('wheel', wheel);
        canvasRef.current.addEventListener('mousemove', move);
        window.addEventListener('resize', resize);
        resize();
        return () => {
            canvasRef.current.removeEventListener('wheel', wheel);
            canvasRef.current.removeEventListener('mousemove', move);
            window.removeEventListener('resize', resize);
        }
    }, [canvasData, drag, mousePos]);

    return (
        <canvas onContextMenu={contextHandler}
                onMouseDown={mouseDownHandler}
                onMouseUp={e => setDrag(false)}
                height={size.height}
                width={size.width}
                ref={canvasRef}
                className="Canvas"/>
    )
}
