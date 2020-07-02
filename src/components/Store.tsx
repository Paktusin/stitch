import React, {useEffect} from "react";
import {Zoom, zoomSettings} from "../types/zoom";
import {actionTypes, initialState, mainReducer} from "./reducer";
import {StitchType} from "../types/stitch";
import {localStorageService} from "../services/localStorageService";
import {SymbolType} from "../types/symbol";

export interface StoreType {
    zoom: Zoom,
    stitchType: StitchType
    symbol: SymbolType
}

export interface DispatchType {
    setZoom: (value: Zoom) => void,
    setStitchType: (value: StitchType) => void,
    setSymbol: (value: SymbolType) => void,
}

// @ts-ignore
export const StateContext = React.createContext<StoreType>();
// @ts-ignore
export const DispatchContext = React.createContext<DispatchType>();

export const Store = ({children}: any) => {
    const [state, dispatch] = React.useReducer(mainReducer, {
        ...initialState,
        zoom: localStorageService.get('zoom', 1)
    });
    const actionList = React.useMemo(() => ({
        setZoom: (value: Zoom) => dispatch({type: actionTypes.SET_ZOOM, value}),
        setSymbol: (value: StitchType) => dispatch({type: actionTypes.SET_SYMBOL, value}),
        setStitchType: (value: StitchType) => dispatch({type: actionTypes.SET_STITCH_TYPE, value}),
    }), [dispatch]);

    useEffect(() => {
        localStorageService.put('zoom', state.zoom)
    }, [state.zoom])

    return (
        <DispatchContext.Provider value={actionList}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}
