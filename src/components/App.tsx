import React from 'react';
import './App.scss';
import {Canvas} from "./Canvas/Canvas";
import {Panel} from "./Panel/Panel";

function App() {
    return (
        <div className="app">
            <Panel/>
            <div className="mainArea">
                <div className="canvasContainer">
                    <Canvas/>
                </div>
                <Panel vertical={true}/>
            </div>
        </div>
    );
}

export default App;
