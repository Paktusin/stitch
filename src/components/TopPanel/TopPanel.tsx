import React, {FunctionComponent, useContext} from "react";
import {Panel} from "../Panel/Panel";
import {stitchTypes} from "../../types/stitch";
import {DispatchContext, StoreContext} from "../Store";
import {ViewToolBar} from "../ViewToolBar/ViewToolBar";
import {BackToolBar, BackToolBarType} from "../BackPanel/BackToolBar";
import {Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {getStitchImage} from "../../services/stitchImages";
import {zoomSettings} from "../../types/zoom";


export type TopPanelType = {} & BackToolBarType

export const TopPanel: FunctionComponent<TopPanelType> = ({onChangeColor, project, onChangePicture}) => {

    const {setStitchType, setShowSymbols, setZoom} = useContext(DispatchContext);
    const {stitchType, showSymbols, zoom} = useContext(StoreContext);

    function zoomHandler(out = false) {
        if (zoom.scale >= zoomSettings.max && !out || zoomSettings.min >= zoom.scale && out) return;
        setZoom({...zoom, scale: zoom.scale + (out ? -1 : 1)})
    }

    return (
        <Panel>
            <ButtonGroup className={"mr-1"}>
                {stitchTypes.map((type, index) => {
                        const svg = getStitchImage(type);
                        return (
                            <Button size={"sm"}
                                    active={type === stitchType}
                                    key={index}
                                    onClick={() => setStitchType(type)}>
                                <img src={svg.path} style={{transform: `rotate(${svg.rotate}deg)`}}/>
                            </Button>
                        )
                    }
                )}
            </ButtonGroup>
            {false && <ButtonGroup className={"mr-1"}>
                <Button size={"sm"} onClick={() => setShowSymbols(!showSymbols)}>
                    {showSymbols ? 'symbols' : 'stitches'}
                </Button>
            </ButtonGroup>}
            <ButtonGroup className={'mr-1'}>
                <Button size={"sm"} title={'zoom in'} onClick={() => zoomHandler()}>+</Button>
                <Button size={"sm"} title={'zoom out'} onClick={() => zoomHandler(true)}>-</Button>
            </ButtonGroup>
            <ViewToolBar/>
            <BackToolBar project={project}
                         onChangeColor={onChangeColor}
                         onChangePicture={onChangePicture}/>
            <Link className={"ml-1 btn btn-primary btn-sm"}
                  to={`/print/${project.id}`}>Print</Link>
            <Link className={"ml-auto btn btn-primary btn-sm"}
                  to={`/`}>Home</Link>
        </Panel>
    )
}
