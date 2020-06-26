import React, {useMemo} from 'react';
import './App.scss';
import {Canvas} from "./Canvas/Canvas";
import {Panel} from "./Panel/Panel";
import {CanvasType} from "../models/canvasType";

function App() {

    const data = useMemo(() => {
        return {
            backgroundColor: 'white',
            stitches: [...Array(100)].map(row => [...Array(100)].map(_ => {
                return {color: 'white', value: '▲'};
            }))
        } as CanvasType
    }, []);

    return (
        <div className="app">
            <Panel/>
            <div className="mainArea">
                <Panel vertical={true}/>
                <div className="canvasContainer">
                    <Canvas data={data}/>
                </div>
                <Panel vertical={true}/>
            </div>
            <Panel/>
        </div>
    );
}

export default App;
