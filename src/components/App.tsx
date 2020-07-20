import React from "react";
import {
    Switch,
    Route, HashRouter
} from "react-router-dom";
import {ProjectEdit} from "./ProjectEdit/ProjectEdit";
import {Home} from "./Home/Home";
import {Editor} from "./Editor/Editor";
import {Store} from "./Store";
import {Print} from "./Print/Print";
import {Test} from "./Test/Test";


export const App = () => {
    return (
        <Store>
            <HashRouter>
                <Switch>
                    <Route path="/edit/:id?">
                        <ProjectEdit/>
                    </Route>
                    <Route path="/draw/:id">
                        <Editor/>
                    </Route>
                    <Route path="/print/:id">
                        <Print/>
                    </Route>
                    <Route path="/test">
                        <Test/>
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </HashRouter>
        </Store>
    )
}
