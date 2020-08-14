import React, {useContext, useEffect, useState} from "react";
import {projectService} from "../../services/dataService";
import {Project} from "../../types/project";
import {Link} from "react-router-dom";
import './Home.scss';
import {Button, ButtonGroup, ListGroup, ListGroupItem} from "react-bootstrap";
import {fileService} from "../../services/fileService";

export function Home() {

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        projectService.list().then(setProjects)
    }, [])

    function deleteHandler(index: number, event: any) {
        event.preventDefault();
        if (window.confirm('Do you want to delete this project ?')) {
            projectService.delete(projects[index]).then(() => {
                const newProjects = [...projects];
                newProjects.splice(index, 1);
                setProjects(newProjects);
            })
        }
    }

    function exportHandler(index: number, event: any) {
        event.preventDefault();
        fileService.exportProject(projects[index]);
    }

    function importHandler() {
        fileService.importProject().then(res => {
            projectService.save(res).then(() => {
                setProjects([...projects, res]);
            });
        })
    }

    return (
        <div className="home">
            <div className="projects">
                <ListGroup>
                    {projects.map((project, index) => {
                        const createdAtDate = new Date(project.createdAt);
                        const updatedAtDate = new Date(project.updatedAt);
                        return (
                            <ListGroupItem key={index}>
                                <div>{project.name}</div>
                                <span
                                    className="small text-black-50">createdAt: {createdAtDate.toLocaleString()}</span><br/>
                                <span
                                    className="small text-black-50 mt-0">updatedAt: {updatedAtDate.toLocaleString()}</span>
                                <ButtonGroup className={'actions'}>
                                    <Link to={`/draw/${project.id}`} component={Button} className="btn-sm">
                                        open
                                    </Link>
                                    <Button onClick={(event: any) => exportHandler(index, event)}
                                            size={'sm'}>export</Button>
                                    <Button onClick={(event: any) => deleteHandler(index, event)} size={'sm'}
                                            variant={"danger"}
                                            title={'delete'}>delete</Button>
                                </ButtonGroup>
                            </ListGroupItem>
                        )
                    })}
                    <ListGroupItem>
                        <Link to={`/edit`} component={Button} className={'btn-success mr-1'}>Create</Link>
                        <Button onClick={importHandler}>Import</Button>
                    </ListGroupItem>
                </ListGroup>
            </div>
        </div>
    )
}
