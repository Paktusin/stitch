import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import './Editor.scss';
import {GridType, Project} from "../../types/project";
import {Canvas} from "../Canvas/Canvas";
import {useParams, useHistory} from "react-router-dom";
import {projectService} from "../../services/dataService";
import {StoreContext} from "../Store";
import {LeftPanel} from "../RightPanel/LeftPanel";
import {TopPanel} from "../TopPanel/TopPanel";
import {Direction, Stitch, StitchType} from "../../types/stitch";
import {SymbolType} from "../../types/symbol";

export const Editor = () => {
    const [project, setProject] = useState<Project>();
    const {id} = useParams();
    const history = useHistory();
    const {symbol, stitchType} = useContext(StoreContext);


    function deleteThreadHandler(symbol: SymbolType) {
        if (project) {
            Object.keys(project.grid).forEach((rowIndex: any) => {
                Object.keys(project.grid[rowIndex]).forEach((colIndex: any) => {
                    const cell = project.grid[rowIndex][colIndex].filter(stitch => stitch.symbol !== symbol);
                    if (!cell.length) {
                        deleteCell(project.grid, rowIndex, colIndex)
                    } else {
                        project.grid[rowIndex][colIndex] = [...cell];
                    }
                })
            })
            const newPalette = {...project.palette}
            delete newPalette[symbol];
            setProject({...project, palette: newPalette, grid: {...project.grid}} as Project);
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
                newGrid[rowIndex][colIndex] = newStitch(symbol, direction, newGrid[rowIndex][colIndex] || [])
            } else {
                deleteCell(newGrid, rowIndex, colIndex)
            }
            setProject({...project, grid: newGrid} as Project);
        }
    }

    function changeColorHandler(color: string) {
        setProject({...project, color} as Project)
    }

    const newStitch = useCallback((symbol: SymbolType, clickDirection: Direction, stitches: Stitch[]): Stitch[] => {
        let direction: Direction = 'f';
        switch (stitchType as StitchType) {
            case 'vx':
                direction = clickDirection.indexOf('l') !== -1 ? 'l' : 'r';
                break;
            case 'hx':
                direction = clickDirection.indexOf('t') !== -1 ? 't' : 'b';
                break;
            case 'sx':
            case 'qx':
            case '3qx':
                direction = clickDirection;
                break;
        }
        return [{symbol, type: stitchType, direction}]
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
        if (project) projectService.save(project).then(() => console.log('saved'))
    }, [project])

    if (!project) return null;

    return (
        <div className="editor">
            <TopPanel project={project}
                      onChangePicture={picture => setProject({...project, picture} as Project)}
                      onChangeColor={changeColorHandler}/>
            <div className="mainArea">
                <LeftPanel palette={project.palette}
                           onChange={palette => setProject({...project, palette} as Project)}
                           onDelete={deleteThreadHandler}
                />
                <Canvas project={project}
                        onCellClick={cellClickHandler}/>
            </div>
        </div>
    );
}
