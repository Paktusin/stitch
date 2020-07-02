import React, {FunctionComponent, useEffect, useMemo, useState} from "react";
import {Thread, vendors} from "../../types/thread";
import cls from 'classnames';
import './PaletteEdit.scss';

export interface PaletteEditType {
    thread?: Thread,
    onSave?: (thread: Thread) => void
    onCancel?: () => void
    onDelete?: () => void
    edit?: boolean
}

export const PaletteEdit: FunctionComponent<PaletteEditType> =
    ({
         thread,
         onSave,
         onCancel,
         onDelete
     }) => {
        const [vendor, setVendor] = useState(thread?.vendor || Object.keys(vendors)[0])
        const [search, setSearch] = useState<string>('')
        const [selectedThread, setThread] = useState<Thread>(thread || vendors[vendor][0]);

        useEffect(() => {
            if (thread) {
                setVendor(thread.vendor as string)
            }
        }, [thread])

        return (
            <div className="PaletteEdit">
                <hr/>
                <label>Vendor</label>
                <select value={vendor} onChange={e => setVendor(e.target.value)}>
                    {Object.keys(vendors).map(vendor =>
                        <option key={vendor} value={vendor}>{vendor}</option>)}
                </select>
                <hr/>
                <label>Threads</label>
                <input placeholder='search code...' value={search} onChange={e => setSearch(e.target.value)}/>
                <div className="threadContainer">
                    {vendors[vendor].map((thread, key) =>
                        <div
                            onClick={e => setThread(thread)}
                            key={key}
                            className={cls('thread', {selected: thread.name === selectedThread?.name})}>
                            {thread.name}
                        </div>
                    )}
                </div>
                <hr/>
                <button onClick={e => onSave && onSave(selectedThread)}>Save</button>
                <button onClick={e => onCancel && onCancel()}>Cancel</button>
                <button onClick={e => onDelete && onDelete()}>Delete</button>
            </div>
        )
    }
