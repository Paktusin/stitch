import React, {useEffect} from "react";
import {projectService} from "../../services/dataService";

export function Home() {

    useEffect(() => {
        projectService.list().then(res => console.log(res))
    }, [])

    return (
        <div>
            Home
        </div>
    )
}
