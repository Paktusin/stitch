import React, {FunctionComponent, useEffect, useMemo, useState} from "react";
import {Thread, vendors} from "../../types/thread";
import cls from 'classnames';
import './PaletteEdit.scss';
import {colorService} from "../../services/colorService";
import {Button, ButtonGroup, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {InputGroupText} from "react-bootstrap/InputGroup";

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
            if (window.confirm('Do you really want to clear thread from project?')) {
                onDelete && onDelete();
            }
        }

        const threads = useMemo(() => vendors[vendor].filter(thread => !search.length || thread.name.indexOf(search) !== -1), [vendor, search])

        return (
            <div className="PaletteEdit">
                <hr/>
                <FormGroup>
                    <FormLabel>Vendor</FormLabel>
                    <FormControl as="select"  value={vendor} onChange={e => setVendor(e.target.value)}>
                        {Object.keys(vendors).map(vendor => <option key={vendor} value={vendor}>{vendor}</option>)}
                    </FormControl>
                </FormGroup>
                <hr/>

                <FormGroup>
                    <FormLabel>Threads</FormLabel>
                    <FormControl type={'text'} placeholder={'search code...'}  value={search} onChange={e => setSearch(e.target.value)}/>
                </FormGroup>
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
                <Button className={'mr-1'} onClick={() => onSave && onSave(selectedThread)}>Save</Button>
                <Button className={'mr-1'} onClick={() => onCancel && onCancel()}>Cancel</Button>
                {thread && <Button className={'mr-1'} onClick={deleteHandler}>Clear</Button>}

            </div>
        )
    }
