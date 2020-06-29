import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {ProjectEdit} from "./ProjectEdit/ProjectEdit";
import {Home} from "./Home/Home";
import {Editor} from "./Editor/Editor";
import {Store} from "./Store";


export const App = () => {
    return (
        <Store>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="/edit/:id?">
                        <ProjectEdit/>
                    </Route>
                    <Route exact path="/draw/:id">
                        <Editor/>
                    </Route>
                </Switch>
            </Router>
        </Store>
    )
}
