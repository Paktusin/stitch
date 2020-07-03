import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import './Editor.scss';
import {GridType, Project} from "../../types/project";
import {Panel} from "../Panel/Panel";
import {Canvas} from "../Canvas/Canvas";
import {useParams, useHistory} from "react-router-dom";
import {projectService} from "../../services/dataService";
import {StoreContext} from "../Store";
import {LeftPanel} from "../RightPanel/LeftPanel";
import {TopPanel} from "../TopPanel/TopPanel";
import {Direction, Stitch} from "../../types/stitch";
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
                    const cell = project.grid[rowIndex][colIndex];
                    if (cell && cell.symbol === symbol) {
                        deleteCell(project.grid, rowIndex, colIndex)
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

    function changeColorHandler(color: string) {
        setProject({...project, color} as Project)
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
        if (project) projectService.save(project).then(() => console.log('saved'))
    }, [project])

    if (!project) return null;

    return (
        <div className="editor">
            <TopPanel onChangeColor={changeColorHandler}/>
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
