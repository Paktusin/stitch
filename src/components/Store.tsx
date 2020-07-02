import React, {useEffect} from "react";
import {Zoom, zoomSettings} from "../types/zoom";
import {actionTypes, initialState, mainReducer} from "./reducer";
import {StitchType} from "../types/stitch";
import {localStorageService} from "../services/localStorageService";
import {SymbolType} from "../types/symbol";
import {ViewType} from "../types/viewType";

export interface StoreType {
    zoom: Zoom,
    stitchType: StitchType
    symbol: SymbolType
    view: ViewType
}

export interface DispatchType {
    setZoom: (value: Zoom) => void,
    setStitchType: (value: StitchType) => void,
    setSymbol: (value: SymbolType) => void,
    setView: (value: ViewType) => void,
}

// @ts-ignore
export const StoreContext = React.createContext<StoreType>();
// @ts-ignore
export const DispatchContext = React.createContext<DispatchType>();

export const Store = ({children}: any) => {
    const [state, dispatch] = React.useReducer(mainReducer, {
        ...initialState,
        zoom: localStorageService.get('zoom', 1),
        view: localStorageService.get('view', 'aida'),
    });
    const actionList = React.useMemo(() => ({
        setZoom: (value: Zoom) => dispatch({type: actionTypes.SET_ZOOM, value}),
        setSymbol: (value: StitchType) => dispatch({type: actionTypes.SET_SYMBOL, value}),
        setStitchType: (value: StitchType) => dispatch({type: actionTypes.SET_STITCH_TYPE, value}),
        setView: (value: ViewType) => dispatch({type: actionTypes.SET_VIEW, value}),
    }), [dispatch]);

    useEffect(() => {
        localStorageService.put('zoom', state.zoom);
        localStorageService.put('view', state.view);
    }, [state.zoom, state.view])

    return (
        <DispatchContext.Provider value={actionList}>
            <StoreContext.Provider value={state}>
                {children}
            </StoreContext.Provider>
        </DispatchContext.Provider>
    )
}
