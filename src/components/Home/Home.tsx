import React, {useEffect, useState} from "react";
import {projectService} from "../../services/dataService";
import {Project} from "../../types/project";
import {Link} from "react-router-dom";
import './Home.scss';
import {Button, ListGroup, ListGroupItem} from "react-bootstrap";

export function Home() {

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        projectService.list().then(setProjects)
    }, [])

    function deleteHandler(index: number) {
        if (window.confirm('Do you want to delete this project ?')) {
            projectService.delete(projects[index]).then(() => {
                const newProjects = [...projects];
                newProjects.splice(index, 1);
                setProjects(newProjects);
            })
        }
    }

    return (
        <div className="home">
            <div className="projects">
                <ListGroup>
                    {projects.map((project, index) => {
                        const createdAtDate = new Date(project.createdAt);
                        const updatedAtDate = new Date(project.updatedAt);
                        return (
                            <Link className={'list-group-item text-decoration-none'} to={`/draw/${project.id}`}
                                  key={index}>
                                <div>{project.name}</div>
                                <span
                                    className="small text-black-50">createdAt: {createdAtDate.toLocaleString()}</span><br/>
                                <span className="small text-black-50">updatedAt: {updatedAtDate.toLocaleString()}</span>
                                <Button onClick={() => deleteHandler(index)} size={'sm'} className={'del-btn'}
                                        variant={"danger"}
                                        title={'delete'}>x</Button>
                            </Link>
                        )
                    })}
                    <Link className={'list-group-item text-decoration-none'} to={`/edit`}>
                        <div>create new</div>
                    </Link>
                </ListGroup>
            </div>
        </div>
    )
}
