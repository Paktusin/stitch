import React, {useContext} from "react";
import {PanelButton} from "../PanleButton/PanelButton";
import {DispatchContext, StoreContext} from "../Store";
import {viewTypes} from "../../types/viewType";

export const ViewToolBar = () => {
    const {view: currentView} = useContext(StoreContext);
    const {setView} = useContext(DispatchContext)

    return (
        <div>
            {viewTypes.map((viewType, key) =>
                <PanelButton key={key} active={viewType === currentView}
                             onClick={e => setView(viewType)}>
                    {viewType}
                </PanelButton>
            )}
        </div>
    )
}
