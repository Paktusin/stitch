import React, {FunctionComponent, useCallback, useEffect, useRef, useState} from "react";
import './Canvas.scss';
import {CanvasType} from "../../types/canvas";
import {drawService} from "../../services/drawService";

export interface CanvasPropsType {
    data: CanvasType;
    onChange?: (canvas: CanvasType) => void
}

export const Canvas: FunctionComponent<CanvasPropsType> = ({data, onChange}) => {
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0});
    const resize = useCallback(() => {
        const parent = canvasRef.current.parentElement;
        if (parent) {
            setSize({height: parent.offsetHeight, width: parent.offsetWidth})
        }
        draw();
    }, [data]);

    function zoomedX_INV(number: number) {
        const {sx, scale, wx} = data.zoom;
        return Math.floor((number - sx) * (1 / scale) + wx);
    }

    function zoomedY_INV(number: number) {
        const {sy, scale, wy} = data.zoom;
        return Math.floor((number - sy) * (1 / scale) + wy);
    }

    // @ts-ignore
    function wheel(e: WheelEvent<HTMLCanvasElement>) {
        const zoomSpeed = 1.3;
        const {scale} = data.zoom;
        onChange && onChange({
            ...data,
            zoom: {
                scale: e.deltaY < 0 ? Math.min(6, scale * zoomSpeed) : Math.max(0.1, scale * (1 / zoomSpeed)),
                wx: zoomedX_INV(e.x),
                wy: zoomedY_INV(e.y),
                sx: e.x,
                sy: e.y,
            }
        });
    }


    useEffect(() => {
        resize();
        canvasRef.current.addEventListener('wheel', wheel);
        window.addEventListener('resize', resize);
        return () => {
            canvasRef.current.removeEventListener('wheel', wheel);
            window.removeEventListener('resize', resize);
        }
    }, [data]);

    function draw() {
        window.requestAnimationFrame(() => {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, size.width, size.height);
                drawService.drawGrid(ctx, data)
            }
        })

    }

    return (
        <canvas height={size.height} width={size.width} ref={canvasRef} className="Canvas"/>
    )
}
