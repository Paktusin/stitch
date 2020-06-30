import React, {useContext, useEffect, useRef, useState} from 'react';
import './Editor.scss';
import {Project} from "../../types/project";
import {Panel} from "../Panel/Panel";
import {Canvas} from "../Canvas/Canvas";
import {useParams, useHistory} from "react-router-dom";
import {projectService} from "../../services/dataService";
import {StateContext, DispatchContext, Store} from "../Store";
import {ZoomLabel} from "../ZoomLabel/ZoomLabel";
import {zoomSettings} from "../../types/zoom";
import {RightPanel} from "../RightPanel/RightPanel";

export const Editor = () => {
    const [project, setProject] = useState<Project>();
    const canvasContainerRef = useRef<HTMLDivElement>(document.createElement('div'));
    const {id} = useParams();
    const history = useHistory();
    const {zoom} = useContext(StateContext);
    const {setZoom} = useContext(DispatchContext);

    function wheel(e: WheelEvent) {
        const {scale} = zoom;
        const newScale = (e.deltaY < 0 ? Math.min(zoomSettings.max, scale * zoomSettings.speed) : Math.max(zoomSettings.min, scale * (1 / zoomSettings.speed)));
        if (newScale !== scale) {
            setZoom({
                ...zoom,
                scale: newScale,
            });
        }
    }

    useEffect(() => {
        projectService.get(id).then(res => {
            if (res) {
                setProject(res)
            } else {
                history.push('/');
            }
        });
    }, [])

    useEffect(() => {
        canvasContainerRef.current.addEventListener('wheel', wheel);
        return () => {
            canvasContainerRef.current.removeEventListener('wheel', wheel);
        }
    }, [zoom, project]);

    if (!project) {
        return null;
    }

    return (
        <div className="editor">
            <Panel size={32}/>
            <div className="mainArea">
                <Panel size={64} vertical={true} border={"Right"}/>
                <div className="canvasContainer" ref={canvasContainerRef}>
                    <ZoomLabel/>
                    <Canvas grid={project.grid} onChange={setProject}/>
                </div>
                <RightPanel palette={project.palette}
                            onChange={palette => setProject({...project, palette} as Project)}/>
            </div>
        </div>
    );
}
