import {StoreType} from "./Store";

export const actionTypes = {
    SET_ZOOM: 'SET_ZOOM',
    SET_PALETTE_ITEM: 'SET_PALETTE_ITEM',
};

export const initialState: StoreType = {
    zoom: {scale: 1, scrollX: 0, scrollY: 0},
    stitchType: 'x',
};

export function mainReducer(state: StoreType, action: { type: string, value: any }) {
    switch (action.type) {
        case actionTypes.SET_ZOOM:
            return {...state, zoom: action.value};
        case actionTypes.SET_PALETTE_ITEM:
            return {...state, paletteItem: action.value};
        default:
            return state;
    }
}
