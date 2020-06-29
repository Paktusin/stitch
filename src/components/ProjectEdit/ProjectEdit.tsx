import React, {FunctionComponent, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {Project} from "../../types/project";
import {projectService} from "../../services/projectService";

export const ProjectEdit: FunctionComponent = () => {
    const {id} = useParams();
    const [project, setProject] = useState<Project>(projectService.getProject(id));
    const [size, setSize] = useState<{ height: number, width: number }>({height: 100, width: 100})
    const history = useHistory();

    function onChangeHandler(prop: string, value: string) {
        setProject({...project, [prop]: value})
    }

    function save() {
        const {id} = projectService.saveProject(project);
        goToEditor(id as string);
    }

    function goToEditor(id?: string) {
        if (id) history.push('/' + id);
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
            {project.id && <button onClick={e => goToEditor(project.id)}>Cancel</button>}
        </div>
    )
}
