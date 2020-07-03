import React, {FunctionComponent, useContext} from "react";
import {Panel} from "../Panel/Panel";
import {stitchTypes} from "../../types/stitch";
import {DispatchContext, StoreContext} from "../Store";
import {ViewToolBar} from "../ViewToolBar/ViewToolBar";
import {BackToolBar, BackToolBarType} from "../BackPanel/BackToolBar";
import {Button, ButtonGroup} from "react-bootstrap";

export type TopPanelType = {} & BackToolBarType

export const TopPanel: FunctionComponent<TopPanelType> = ({onChangeColor, project}) => {

    const {setStitchType} = useContext(DispatchContext);
    const {stitchType} = useContext(StoreContext);

    return (
        <Panel>
            <ButtonGroup className={"mr-1"}>
                {stitchTypes.map((type, index) =>
                    <Button size={"sm"}
                            active={type === stitchType}
                            key={index}
                            onClick={() => setStitchType(type)}>
                        {type}
                    </Button>
                )}
            </ButtonGroup>
            <ViewToolBar/>
            <BackToolBar project={project} onChangeColor={onChangeColor}/>
        </Panel>
    )
}
