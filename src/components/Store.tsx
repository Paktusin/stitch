import React, {Context, useState} from "react";
import {Zoom} from "../types/zoom";
import {actionTypes, initialState, mainReducer} from "./reducer";

export interface StoreType {
    zoom: Zoom,
}

export interface DispatchType {
    setZoom: (zoom: Zoom) => void,
}

// @ts-ignore
export const StateContext = React.createContext<StoreType>();
// @ts-ignore
export const DispatchContext = React.createContext<DispatchType>();

export const Store = ({children}: any) => {
    const [state, dispatch] = React.useReducer(mainReducer, initialState);
    const actionList = React.useMemo(() => ({
        setZoom: (value: Zoom) => dispatch({type: actionTypes.SET_ZOOM, value}),
    }), [dispatch]);

    return (
        <DispatchContext.Provider value={actionList}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}
