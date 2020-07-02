import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import './Editor.scss';
import {GridType, Project} from "../../types/project";
import {Panel} from "../Panel/Panel";
import {Canvas} from "../Canvas/Canvas";
import {useParams, useHistory} from "react-router-dom";
import {projectService} from "../../services/dataService";
import {StateContext, DispatchContext, Store} from "../Store";
import {ZoomLabel} from "../ZoomLabel/ZoomLabel";
import {zoomSettings} from "../../types/zoom";
import {RightPanel} from "../RightPanel/RightPanel";
import {TopPanel} from "../TopPanel/TopPanel";
import {Direction, Stitch} from "../../types/stitch";
import {SymbolType} from "../../types/symbol";

export const Editor = () => {
    const [project, setProject] = useState<Project>();
    const canvasContainerRef = useRef<HTMLDivElement>(document.createElement('div'));
    const {id} = useParams();
    const history = useHistory();
    const {zoom, symbol, stitchType} = useContext(StateContext);
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

    function deleteThreadHandler(symbol: SymbolType) {
        if (project) {
            Object.keys(project.grid).forEach((rowIndex: any) => {
                Object.keys(project.grid[rowIndex]).forEach((colIndex: any) => {
                    const cell = project.grid[rowIndex][colIndex];
                    if (cell && cell.symbol === symbol) {
                        deleteCell(project.grid, rowIndex, colIndex)
                    }
                })
            })
        }
    }

    function deleteCell(grid: GridType, rowIndex: number, colIndex: number): GridType {
        delete grid[rowIndex][colIndex];
        if (Object.keys(grid[rowIndex]).length === 0) {
            delete grid[rowIndex];
        }
        return grid;
    }

    function cellClickHandler(rowIndex: number, colIndex: number, direction: Direction, contextMenu: boolean) {
        if (!project) return
        const newGrid = {...project.grid};
        if (!newGrid[rowIndex]) newGrid[rowIndex] = {};
        if (symbol && project.palette[symbol]) {
            if (!contextMenu) {
                newGrid[rowIndex][colIndex] = {
                    symbol: symbol,
                    stitch: newStitch(direction)
                }
            } else {
                deleteCell(newGrid, rowIndex, colIndex)
            }
            setProject({...project, grid: newGrid} as Project);
        }
    }

    const newStitch = useCallback((clickDirection: Direction): Stitch => {
        let direction: Direction = 'f';
        switch (stitchType) {
            case 'x':
                direction = 'f';
                break;
        }
        return {type: stitchType, direction}
    }, [stitchType])

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

    useEffect(() => {
        if (project) projectService.save(project).then(() => console.log('saved'))
    }, [project])

    if (!project) return null;

    return (
        <div className="editor">
            <TopPanel/>
            <div className="mainArea">
                <Panel size={64} vertical={true} border={"Right"}/>
                <div className="canvasContainer" ref={canvasContainerRef}>
                    <ZoomLabel/>
                    <Canvas project={project}
                            onCellClick={cellClickHandler}/>
                </div>
                <RightPanel palette={project.palette}
                            onChange={palette => setProject({...project, palette} as Project)}
                            onDelete={deleteThreadHandler}
                />
            </div>
        </div>
    );
}
