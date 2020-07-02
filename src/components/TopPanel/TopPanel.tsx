import React, {useContext} from "react";
import {Panel} from "../Panel/Panel";
import {PanelButton} from "../PanleButton/PanelButton";
import {stitchTypes} from "../../types/stitch";
import {DispatchContext, StateContext} from "../Store";

export const TopPanel = () => {

    const {setStitchType} = useContext(DispatchContext);
    const {stitchType} = useContext(StateContext);

    return (
        <Panel size={32}>
            {stitchTypes.map((type,index) =>
                <PanelButton active={type === stitchType}
                             key={index}
                             onClick={e => setStitchType(type)}>
                    {type}
                </PanelButton>
            )}
        </Panel>
    )
}
