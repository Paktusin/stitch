import React, {useEffect, useMemo, useRef, useState} from 'react';
import './Editor.scss';
import {Project} from "../../types/project";
import {Panel} from "../Panel/Panel";
import {Canvas} from "../Canvas/Canvas";
import {ZoomType} from "../../types/zoom";

function Editor() {
    const [data, setData] = useState<Project>(new Project());
    const [zoom, setZoom] = useState<ZoomType>({scale: 1, scrollY: 0, scrollX: 0})
    const canvasContainerRef = useRef<HTMLDivElement>(document.createElement('div'));

    function changeHandler(data: Project) {
        setData(data);
    }


    function wheel(e: WheelEvent) {
        const zoomSpeed = 1.3;
        const {scale} = zoom;
        const newScale = (e.deltaY < 0 ? Math.min(5, scale * zoomSpeed) : Math.max(0.7, scale * (1 / zoomSpeed)));
        if (newScale !== scale) {
            setZoom({
                ...zoom,
                scale: newScale,
            });
        }
    }

    useEffect(() => {
        canvasContainerRef.current.addEventListener('wheel', wheel);
        return () => {
            canvasContainerRef.current.removeEventListener('wheel', wheel);
        }
    }, [data]);

    return (
        <div className="app">
            <Panel/>
            <div className="mainArea">
                <Panel vertical={true}/>
                <div className="canvasContainer" ref={canvasContainerRef}>
                    <Canvas zoom={zoom} canvasData={data} onChange={changeHandler}/>
                </div>
                <Panel vertical={true}/>
            </div>
            <Panel/>
        </div>
    );
}

export default Editor;
