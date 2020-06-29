import React, {FunctionComponent, useState} from 'react';
import {useParams, useHistory, Link} from 'react-router-dom';
import {Project} from "../../types/project";
import {Cell} from "../../types/cell";
import {projectService} from "../../services/dataService";

export const ProjectEdit: FunctionComponent = () => {
    const {id} = useParams();
    const [project, setProject] = useState<Project>(new Project());
    const [size, setSize] = useState<{ height: number, width: number }>({height: 100, width: 100})
    const history = useHistory();

    function onChangeHandler(prop: string, value: string) {
        setProject({...project, [prop]: value} as Project)
    }

    function changeSize() {
        const oldGrid = project.grid;
        project.grid = [...Array(size.height)].map((_, rowIndex) => {
            return [...Array(size.width)].map((_, cellIndex) => {
                return (oldGrid[rowIndex] && oldGrid[rowIndex][cellIndex]) || new Cell();
            });
        })
    }

    function save() {
        changeSize();
        projectService.save(project).then(id => {
            history.push(`/draw/${id}`)
        })
    }

    return (
        <div>
            <div>
                <label>Project</label>
                <input value={project.name} onChange={e => onChangeHandler('name', e.target.value)}/>
            </div>

            <div>
                <label>Height (stitches)</label>
                <input value={size.height} onChange={e => setSize({...size, height: parseInt(e.target.value)})}/>
            </div>

            <div>
                <label>Height (stitches)</label>
                <input value={size.width} onChange={e => setSize({...size, width: parseInt(e.target.value)})}/>
            </div>

            <button onClick={e => save()}>{project.id ? 'Save' : 'Create'}</button>
            <Link to={'/' + (project.id ? `draw/${project.id}` : '')}>Cancel</Link>
        </div>
    )
}
