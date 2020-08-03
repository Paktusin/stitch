import React, {FunctionComponent, useContext} from "react";
import {Panel} from "../Panel/Panel";
import {stitchTypes} from "../../types/stitch";
import {DispatchContext, StoreContext} from "../Store";
import {ViewToolBar} from "../ViewToolBar/ViewToolBar";
import {BackToolBar, BackToolBarType} from "../BackPanel/BackToolBar";
import {Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {getStitchImage} from "../../services/stitchImages";


export type TopPanelType = {} & BackToolBarType

export const TopPanel: FunctionComponent<TopPanelType> = ({onChangeColor, project, onChangePicture}) => {

    const {setStitchType, setShowSymbols} = useContext(DispatchContext);
    const {stitchType, showSymbols} = useContext(StoreContext);

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
            <ButtonGroup className={"mr-1"}>
                <Button size={"sm"} onClick={() => setShowSymbols(!showSymbols)}>
                    {showSymbols ? 'symbols' : 'stitches'}
                </Button>
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
