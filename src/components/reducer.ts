import {StoreType} from "./Store";
import {symbolTypes} from "../types/symbol";
import {viewTypes} from "../types/viewType";
import {stitchTypes} from "../types/stitch";

export const actionTypes = {
    SET_ZOOM: 'SET_ZOOM',
    SET_SYMBOL: 'SET_SYMBOL',
    SET_STITCH_TYPE: 'SET_STITCH_TYPE',
    SET_VIEW: 'SET_VIEW',
    SET_SHOW_SYMBOLS: 'SET_SHOW_SYMBOLS',
};

export const initialState: StoreType = {
    zoom: {scale: 1, scrollX: 0, scrollY: 0},
    stitchType: stitchTypes[0],
    symbol: symbolTypes[0],
    view: viewTypes[0],
    showSymbols: false
};

export function mainReducer(state: StoreType, action: { type: string, value: any }) {
    switch (action.type) {
        case actionTypes.SET_ZOOM:
            return {...state, zoom: action.value};
        case actionTypes.SET_SYMBOL:
            return {...state, symbol: action.value};
        case actionTypes.SET_STITCH_TYPE:
            return {...state, stitchType: action.value};
        case actionTypes.SET_VIEW:
            return {...state, view: action.value};
        case actionTypes.SET_SHOW_SYMBOLS:
            return {...state, showSymbols: action.value};
        default:
            return state;
    }
}
