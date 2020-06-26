import React, {useMemo, useState} from 'react';
import './App.scss';
import {Canvas} from "./Canvas/Canvas";
import {Panel} from "./Panel/Panel";
import {CanvasType} from "../types/canvas";

function App() {

    const [data, setData] = useState<CanvasType>({
        zoom: {wx: 0, scale: 1, sx: 0, sy: 0, wy: 0},
        backgroundColor: 'white',
        stitches: [...Array(100)].map(() => [...Array(100)].map(() => {
            return {color: 'white', value: '▲'};
        }))
    });

    function changeHandler(data: CanvasType) {
        setData(data);
    }

    return (
        <div className="app">
            <Panel/>
            <div className="mainArea">
                <Panel vertical={true}/>
                <div className="canvasContainer">
                    <Canvas data={data} onChange={changeHandler}/>
                </div>
                <Panel vertical={true}/>
            </div>
            <Panel/>
        </div>
    );
}

export default App;
