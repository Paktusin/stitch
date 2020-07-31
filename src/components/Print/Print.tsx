import React, {useEffect, useMemo, useState} from "react";
import './Print.scss'
import {useParams} from "react-router-dom";
import {projectService} from "../../services/dataService";
import {Project} from "../../types/project";
import {Cell} from "../../types/cell";
import {StitchTable} from "../StitchTable/StitchTable";

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

    useEffect(() => {
        projectService.get(id).then(setProject);
    }, [])

    if (!project) return null;

    return (
        <div className="Print">
            <div className="Paper">
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
            </div>
        </div>
    )
}
