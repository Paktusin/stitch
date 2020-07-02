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
                {projects.map((project,key) => {
                    const createdAtDate = new Date(project.createdAt);
                    const updatedAtDate = new Date(project.updatedAt);
                    return (<Link to={`/draw/${project.id}`} key={key}>
                        <li>{project.name} createdAt: {createdAtDate.toLocaleString()} | updatedAt: {updatedAtDate.toLocaleString()}</li>
                    </Link>)
                })}
            </ul>
        </div>
    )
}
