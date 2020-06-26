import React, {FunctionComponent, useCallback, useEffect, useRef, useState} from "react";
import './Canvas.scss';
import {CanvasType} from "../../models/canvasType";
import {drawService} from "../../services/drawService";

export interface CanvasPropsType {
    data: CanvasType;
}

export const Canvas: FunctionComponent<CanvasPropsType> = ({data}) => {
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0});
    const resize = useCallback(() => {
        const parent = canvasRef.current.parentElement;
        if (parent) {
            setSize({height: parent.offsetHeight, width: parent.offsetWidth})
        }
        draw();
    }, [])

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, []);


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
