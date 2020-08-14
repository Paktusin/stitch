import React, {useEffect} from "react";
import {Zoom, zoomSettings} from "../types/zoom";
import {actionTypes, initialState, mainReducer} from "./reducer";
import {StitchType, stitchTypes} from "../types/stitch";
import {localStorageService} from "../services/localStorageService";
import {SymbolType, symbolTypes} from "../types/symbol";
import {ViewType} from "../types/viewType";

export interface StoreType {
    zoom: Zoom,
    stitchType: StitchType,
    symbol: SymbolType,
    view: ViewType,
    showSymbols: boolean,
}

export interface DispatchType {
    setZoom: (value: Zoom) => void,
    setStitchType: (value: StitchType) => void,
    setSymbol: (value: SymbolType) => void,
    setView: (value: ViewType) => void,
    setShowSymbols: (value: boolean) => void,
}

// @ts-ignore
export const StoreContext = React.createContext<StoreType>();
// @ts-ignore
export const DispatchContext = React.createContext<DispatchType>();

export const Store = ({children}: any) => {
    const [state, dispatch] = React.useReducer(mainReducer, {
        ...initialState,
        zoom: localStorageService.get('zoom', initialState.zoom),
        view: localStorageService.get('view', initialState.view),
        stitchType: localStorageService.get('stitchType', initialState.stitchType),
        symbol: localStorageService.get('symbol', initialState.symbol),
        showSymbols: true,//localStorageService.get('showSymbols', initialState.showSymbols),
    });
    const actionList = React.useMemo(() => ({
        setZoom: (value: Zoom) => dispatch({type: actionTypes.SET_ZOOM, value}),
        setSymbol: (value: StitchType) => dispatch({type: actionTypes.SET_SYMBOL, value}),
        setStitchType: (value: StitchType) => dispatch({type: actionTypes.SET_STITCH_TYPE, value}),
        setView: (value: ViewType) => dispatch({type: actionTypes.SET_VIEW, value}),
        setShowSymbols: (value: boolean) => dispatch({type: actionTypes.SET_SHOW_SYMBOLS, value}),
    }), [dispatch]);

    useEffect(() => {
        localStorageService.put('zoom', state.zoom);
        localStorageService.put('view', state.view);
        localStorageService.put('stitchType', state.stitchType);
        localStorageService.put('symbol', state.symbol);
        localStorageService.put('showSymbols', state.showSymbols);
    }, [state])

    return (
        <DispatchContext.Provider value={actionList}>
            <StoreContext.Provider value={state}>
                {children}
            </StoreContext.Provider>
        </DispatchContext.Provider>
    )
}
