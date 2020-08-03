import React, {useEffect, useMemo, useRef, useState} from "react";
import './Print.scss'
import {Link, useParams} from "react-router-dom";
import {projectService} from "../../services/dataService";
import {Project} from "../../types/project";
import {Cell} from "../../types/cell";
import {StitchTable} from "../StitchTable/StitchTable";
import {Zoom} from "../../types/zoom";
import {Canvas, CELL_SIZE} from "../Canvas/Canvas";
import {Child} from "../Child";
import {Panel} from "../Panel/Panel";

export const Print = () => {
    const {id} = useParams();
    const [project, setProject] = useState<Project>();
    const [xStitches, backStitches, halfStitch] = useMemo(() => {
        const xStitches: Set<string> = new Set(),
            backStitches: Set<string> = new Set(),
            halfStitch: Set<string> = new Set();
        if (project) {
            Object.keys(project.grid).forEach((rowIndex) => {
                Object.keys(project.grid[rowIndex as any]).forEach(cellIndex => {
                    const cell = project.grid[rowIndex as any][cellIndex as any] as Cell;
                    cell.forEach(stitch => {
                        if (['\\', '/'].indexOf(stitch.type) !== -1) {
                            halfStitch.add(stitch.symbol);
                        } else {
                            xStitches.add(stitch.symbol);
                        }
                    })
                })
            });
        }
        return [Array.from(xStitches), Array.from(backStitches), Array.from(halfStitch)];
    }, [project]);
    const [range, setRange] = useState({x: 40, y: 50});
    const [xorNum, setXorNum] = useState(4);
    const pageRef = useRef(document.createElement('div'));

    useEffect(() => {
        projectService.get(id).then(setProject);
    }, [])

    const parts: { x: number, y: number }[] = useMemo(() => {
        if (!project) return [];
        return Array(Math.ceil(project.height / (range.y - xorNum))).fill(null)
            .reduce((prev, _, rowIndex) => prev.concat(Array(Math.ceil(project.width / (range.x - xorNum))).fill(null)
                .map((_, colIndex) => ({x: colIndex * (range.x - xorNum), y: rowIndex * (range.y - xorNum)}))), [])
    }, [project]);

    const staticZoom: Zoom = {
        scrollX: 0,
        scrollY: 0,
        scale: Math.min(
            Math.floor(pageRef.current.clientWidth / CELL_SIZE / (range.x + xorNum)),
            Math.floor(pageRef.current.clientHeight / CELL_SIZE / (range.y + xorNum)),
        )
    }

    return (
        <div className="print">
            <Panel>
                <Link className={"m-auto btn btn-primary btn-sm"} to={`/draw/${project?.id}`}>Edit</Link>
            </Panel>
            <div className="paper">
                <div className="page">
                    <div ref={pageRef}>
                        {project &&
                        <Child>
                            <h3>X stitches</h3>
                            <StitchTable palette={project.palette} symbols={xStitches}/>
                            {!!backStitches.length && [
                                <h3>Back stitches</h3>,
                                <StitchTable palette={project.palette} symbols={backStitches}/>
                            ]}
                            {!!halfStitch.length && [
                                <h3>Half stitches</h3>,
                                <StitchTable palette={project.palette} symbols={halfStitch}/>
                            ]}
                        </Child>}
                    </div>
                </div>
                {project && parts.map((part, index) =>
                    <div key={index} className="page">
                        <div className={'canvas'} style={{
                            width: staticZoom.scale * (range.x + xorNum) * CELL_SIZE,
                            height: staticZoom.scale * (range.y + xorNum) * CELL_SIZE,
                        }}>
                            <Canvas project={project} staticZoom={{
                                ...staticZoom,
                                scrollX: part.x * CELL_SIZE * staticZoom.scale,
                                scrollY: part.y * CELL_SIZE * staticZoom.scale,
                            }}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
