import React, {FunctionComponent, useEffect, useMemo, useState} from "react";
import {symbolTypes} from "../../types/symbol";
import {vendors} from "../../types/thread";
import {Palette} from "../Palette/Palette";
import {PaletteType} from "../../types/paletteType";
import './PaletteEdit.scss';

export interface PaletteEditType {
    paletteItem?: PaletteType,
    onSave?: (paletteItem: PaletteType) => void
    onCancel?: () => void
    onDelete?: () => void
    edit?: boolean
}

export const PaletteEdit: FunctionComponent<PaletteEditType> =
    ({
         paletteItem,
         onSave,
         edit = false,
         onCancel,
         onDelete
     }) => {
        const [vendor, setVendor] = useState(paletteItem?.thread?.vendor || Object.keys(vendors)[0])
        const [search, setSearch] = useState<string>('')
        const [pItem, setPItem] = useState<PaletteType>(paletteItem || {
            thread: vendors[vendor][0],
            symbol: symbolTypes[0]
        });
        const palette: PaletteType[] = useMemo(() => vendors[vendor]
            .filter(thread => !search.length || thread.name.indexOf(search) !== -1)
            .map(thread => ({
                symbol: '',
                thread
            })), [vendor, search])

        function clickHandler(paletteItem: PaletteType) {
            setPItem({...pItem, thread: paletteItem.thread});
        }

        useEffect(() => {
            if (paletteItem) {
                setPItem({...paletteItem});
                setVendor(paletteItem.thread?.vendor as string)
            }
        }, [paletteItem])

        return (
            <div className="PaletteEdit">
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
                <input placeholder='search code...' value={search} onChange={e => setSearch(e.target.value)}/>
                <div className="paletteContainer">
                    <Palette palette={palette} onClick={clickHandler} selected={{thread: pItem.thread, symbol: ''}}/>
                </div>
                <hr/>
                <button onClick={e => onSave && onSave(pItem)}>Save</button>
                <button onClick={e => onCancel && onCancel()}>Cancel</button>
                <button onClick={e => onDelete && onDelete()}>Delete</button>
            </div>
        )
    }
