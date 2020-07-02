import {StoreType} from "./Store";
import {symbolTypes} from "../types/symbol";

export const actionTypes = {
    SET_ZOOM: 'SET_ZOOM',
    SET_SYMBOL: 'SET_SYMBOL',
    SET_STITCH_TYPE: 'SET_STITCH_TYPE',
};

export const initialState: StoreType = {
    zoom: {scale: 1, scrollX: 0, scrollY: 0},
    stitchType: 'x',
    symbol: symbolTypes[0]
};

export function mainReducer(state: StoreType, action: { type: string, value: any }) {
    switch (action.type) {
        case actionTypes.SET_ZOOM:
            return {...state, zoom: action.value};
        case actionTypes.SET_SYMBOL:
            return {...state, symbol: action.value};
        case actionTypes.SET_STITCH_TYPE:
            return {...state, stitchType: action.value};
        default:
            return state;
    }
}
