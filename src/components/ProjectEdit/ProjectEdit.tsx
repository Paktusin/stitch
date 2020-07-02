import React, {FunctionComponent, useEffect, useState} from 'react';
import {useParams, useHistory, Link} from 'react-router-dom';
import {Project} from "../../types/project";
import {projectService} from "../../services/dataService";

export const ProjectEdit: FunctionComponent = () => {
    const {id} = useParams();
    const [project, setProject] = useState<Project>(new Project());
    const history = useHistory();

    function onChangeHandler(prop: string, value: any) {
        setProject({...project, [prop]: value} as Project)
    }


    function save() {
        projectService.save(project).then(id => {
            history.push(`/draw/${id}`)
        })
    }

    useEffect(() => {
        if (id) {
            projectService.get(id).then(res => setProject(res));
        }
    }, [])

    return (
        <div>
            <div>
                <label>Project</label>
                <input value={project.name} onChange={e => onChangeHandler('name', e.target.value)}/>
            </div>

            <div>
                <label>Height (stitches)</label>
                <input type="number" value={project.width}
                       onChange={e => onChangeHandler('width', parseInt(e.target.value))}/>
            </div>

            <div>
                <label>Height (stitches)</label>
                <input type="number" value={project.height}
                       onChange={e => onChangeHandler('height', parseInt(e.target.value))}/>
            </div>

            <button onClick={e => save()}>{project.id ? 'Save' : 'Create'}</button>
            <Link to={'/' + (project.id ? `draw/${project.id}` : '')}>Cancel</Link>
        </div>
    )
}
