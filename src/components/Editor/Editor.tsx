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
import {Cell} from "../../types/cell";
import {paths} from "../../types/paths";

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
                newGrid[rowIndex][colIndex] = newCell(symbol, direction, newGrid[rowIndex][colIndex] || [])
            } else {
                deleteCell(newGrid, rowIndex, colIndex)
            }
            setProject({...project, grid: newGrid} as Project);
        }
    }

    function changeColorHandler(color: string) {
        setProject({...project, color} as Project)
    }

    const newCell = useCallback((symbol: SymbolType, clickDirection: Direction, cell: Cell): Cell => {
        const keys = Object.keys(paths[stitchType]);
        const regexp = /.{1,2}/g;
        let directions: any = [];
        switch (stitchType as StitchType) {
            case 'vx':
                directions = clickDirection.indexOf('l') !== -1 ? keys[0].match(regexp) : keys[1].match(regexp);
                break;
            case 'hx':
                directions = clickDirection.indexOf('t') !== -1 ? keys[0].match(regexp) : keys[1].match(regexp);
                break;
            case 'sx':
            case 'qx':
                directions = [clickDirection];
                break;
            case '3qx':
                const foundKey = keys.find(key => (key.match(regexp) as any)[1] === clickDirection) as string;
                directions = foundKey.match(regexp);
                break;
            case'/':
            case'\\':
            case'x':
                directions = keys[0].match(regexp)
                break;
        }
        const newStitch: Stitch = {symbol, type: stitchType, directions};
        const newCell = [...cell.filter(stitch => {
            return !stitch.directions.filter(direction => directions.find((newDirection: Direction) => newDirection === direction)).length
        }), newStitch];
        return newCell;
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
                <Canvas project={project} onCellClick={cellClickHandler}/>
            </div>
        </div>
    );
}
