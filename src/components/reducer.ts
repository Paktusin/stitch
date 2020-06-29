import {StoreType} from "./Store";

export const actionTypes = {
    SET_ZOOM: 'SET_ZOOM',
};

export const initialState: StoreType = {
    zoom: {scale: 1, scrollX: 0, scrollY: 0},
};

export function mainReducer(state: StoreType, action: { type: string, value: any }) {
    switch (action.type) {
        case actionTypes.SET_ZOOM:
            return {...state, zoom: action.value};
        default:
            return state;
    }
}
