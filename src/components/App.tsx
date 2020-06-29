import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {ProjectEdit} from "./ProjectEdit/ProjectEdit";
import Editor from "./Editor/Editor";
import {Home} from "./Home/Home";


export const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" >
                    <Home/>
                </Route>
                <Route exact path="/edit/:id" >
                    <ProjectEdit/>
                </Route>
                <Route exact path="/:id" >
                    <Editor/>
                </Route>
            </Switch>
        </Router>
    )
}
