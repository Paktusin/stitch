import React, {useEffect, useState} from "react";
import {projectService} from "../../services/dataService";
import {Project} from "../../types/project";
import {Link} from "react-router-dom";

export function Home() {

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        projectService.list().then(setProjects)
    }, [])

    return (
        <div>
            <Link to={'/edit'}>new</Link>
            Recent projects:
            <ul>
                {projects.map(project => <Link to={`/draw/${project.id}`}>
                    <li>{project.name}</li>
                </Link>)}
            </ul>
        </div>
    )
}
