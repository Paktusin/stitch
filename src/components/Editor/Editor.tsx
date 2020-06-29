import React, {useEffect, useMemo, useRef, useState} from 'react';
import './Editor.scss';
import {Project} from "../../types/project";
import {Panel} from "../Panel/Panel";
import {Canvas} from "../Canvas/Canvas";
import {ZoomType} from "../../types/zoom";
import {useParams} from "react-router-dom";
import {projectService} from "../../services/dataService";

function Editor() {
    const [project, setProject] = useState<Project>();
    const [zoom, setZoom] = useState<ZoomType>({scale: 1, scrollY: 0, scrollX: 0})
    const canvasContainerRef = useRef<HTMLDivElement>(document.createElement('div'));
    const {id} = useParams();


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
        projectService.get(id).then(setProject);
    }, [])

    useEffect(() => {
        canvasContainerRef.current.addEventListener('wheel', wheel);
        return () => {
            canvasContainerRef.current.removeEventListener('wheel', wheel);
        }
    }, [project]);

    if (!project) {
        return null;
    }

    return (
        <div className="app">
            <Panel/>
            <div className="mainArea">
                <Panel vertical={true}/>
                <div className="canvasContainer" ref={canvasContainerRef}>
                    <Canvas zoom={zoom} canvasData={project} onChange={setProject}/>
                </div>
                <Panel vertical={true}/>
            </div>
            <Panel/>
        </div>
    );
}

export default Editor;
