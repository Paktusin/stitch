import React, {useContext} from "react";
import {DispatchContext, StoreContext} from "../Store";
import {viewTypes} from "../../types/viewType";
import {Button, ButtonGroup} from "react-bootstrap";

export const ViewToolBar = () => {
    const {view: currentView} = useContext(StoreContext);
    const {setView} = useContext(DispatchContext)

    return (
        <ButtonGroup className={'mr-1'}>
            {viewTypes.map((viewType, key) =>
                <Button size={"sm"} key={key} active={viewType === currentView}
                        onClick={() => setView(viewType)}>
                    {viewType}
                </Button>
            )}
        </ButtonGroup>
    )
}
