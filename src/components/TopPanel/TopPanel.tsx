import React, {useContext} from "react";
import {Panel} from "../Panel/Panel";
import {PanelButton} from "../PanleButton/PanelButton";
import {stitchTypes} from "../../types/stitch";
import {DispatchContext, StoreContext} from "../Store";
import {ViewToolBar} from "../ViewToolBar/ViewToolBar";

export const TopPanel = () => {

    const {setStitchType} = useContext(DispatchContext);
    const {stitchType} = useContext(StoreContext);

    return (
        <Panel size={32}>
            {stitchTypes.map((type, index) =>
                <PanelButton active={type === stitchType}
                             key={index}
                             onClick={e => setStitchType(type)}>
                    {type}
                </PanelButton>
            )}

            <ViewToolBar/>
        </Panel>
    )
}
