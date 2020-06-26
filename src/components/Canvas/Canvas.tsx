import React, {useCallback, useRef, useState} from "react";
import './Canvas.scss';


export const Canvas = () => {
    const [size, setSize] = useState<{ height: number, width: number }>({height: 0, width: 0})
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    // const resize = useCallback(() => {
    //     setSize({height:canvasRef.current.parentElement.})
    // }, []);
    //
    // useState(() => {
    //     resize();
    //     window.addEventListener('resize', resize);
    //     return () => {
    //         window.removeEventListener('resize', resize);
    //     }
    // }, [])

    return (
        <canvas ref={canvasRef} width={size.width} height={size.height} className="Canvas"/>
    )
}
