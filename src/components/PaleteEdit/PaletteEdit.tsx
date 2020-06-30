import React, {FunctionComponent, useMemo, useState} from "react";
import {symbolTypes} from "../../types/symbol";
import {vendors} from "../../types/thread";
import {Palette} from "../Palette/Palette";
import {PaletteType} from "../../types/paletteType";

export interface PaletteEditType {
    paletteItem?:  PaletteType,
    onSave?: (paletteItem?: PaletteType) => void
}

export const PaletteEdit: FunctionComponent<PaletteEditType> = ({paletteItem, onSave}) => {

    const [vendor, setVendor] = useState(paletteItem?.thread?.vendor || Object.keys(vendors)[0])
    const [pItem, setPItem] = useState<PaletteType>(paletteItem || {
        thread: vendors[vendor][0],
        symbol: symbolTypes[0]
    });
    const palette: PaletteType[] = useMemo(() => vendors[vendor].map(thread => ({
        symbol: '',
        thread
    })), [vendor])

    function clickHandler(paletteItem: PaletteType) {
        setPItem({...pItem, thread: paletteItem.thread});
    }

    return (
        <div>
            <label>Symbol</label>
            <select value={pItem.symbol} onChange={e => setPItem({...pItem, symbol: e.target.value})}>
                {symbolTypes.map(symbol => <option
                    key={symbol}
                    value={symbol}>{symbol}</option>)}
            </select>
            <hr/>
            <label>Vendor</label>
            <select value={vendor} onChange={e => setVendor(e.target.value)}>
                {Object.keys(vendors).map(vendor =>
                    <option key={vendor} value={vendor}>{vendor}</option>)}
            </select>
            <hr/>
            <label>Threads</label>
            <Palette palette={palette} onClick={clickHandler} selected={{thread: pItem.thread, symbol: ''}}/>
            <hr/>
            <button onClick={e => onSave && onSave(pItem)}>Save</button>
            <button onClick={e => onSave && onSave()}>Cancel</button>
        </div>
    )
}
