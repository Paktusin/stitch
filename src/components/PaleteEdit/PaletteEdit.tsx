import React, {FunctionComponent, useEffect, useMemo, useState} from "react";
import {Thread, vendors} from "../../types/thread";
import cls from 'classnames';
import './PaletteEdit.scss';
import {colorService} from "../../services/colorService";

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

        function deleteHandler() {
            if (window.confirm('Do you really want to delete thread from project?')) {
                onDelete && onDelete();
            }
        }

        const threads = useMemo(() => vendors[vendor].filter(thread => !search.length || thread.name.indexOf(search) !== -1), [vendor, search])

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
                    {threads.map((thread, key) => {
                            const color = colorService.strRgbContrast(thread.color);
                            return (
                                <div
                                    style={{
                                        borderColor: color,
                                        backgroundColor: thread.color,
                                        color: color
                                    }}
                                    onClick={e => setThread(thread)}
                                    onDoubleClick={e => onSave && onSave(thread)}
                                    key={key}
                                    className={cls('thread', {selected: thread.name === selectedThread?.name})}>
                                    {thread.name}
                                </div>
                            )
                        }
                    )}
                </div>
                <hr/>
                <button onClick={e => onSave && onSave(selectedThread)}>Save</button>
                <button onClick={e => onCancel && onCancel()}>Cancel</button>
                <button onClick={deleteHandler}>Delete</button>
            </div>
        )
    }
