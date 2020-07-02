import React, {useEffect} from "react";
import {Zoom, zoomSettings} from "../types/zoom";
import {actionTypes, initialState, mainReducer} from "./reducer";
import {StitchType} from "../types/stitch";
import {PaletteType} from "../types/paletteType";
import {localStorageService} from "../services/localStorageService";

export interface StoreType {
    zoom: Zoom,
    stitchType: StitchType
    paletteItem?: PaletteType
}

export interface DispatchType {
    setZoom: (value: Zoom) => void,
    setPaletteItem: (value: PaletteType) => void,
    setStitchType: (value: StitchType) => void,
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
        setPaletteItem: (value: PaletteType) => dispatch({type: actionTypes.SET_PALETTE_ITEM, value}),
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
