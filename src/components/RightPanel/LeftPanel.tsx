import React, {FunctionComponent, useContext, useEffect, useMemo, useState} from "react";
import {Panel} from "../Panel/Panel";
import {Palette} from "../Palette/Palette";
import {PaletteType} from "../../types/paletteType";
import {PaletteEdit} from "../PaleteEdit/PaletteEdit";
import {SymbolType, symbolTypes} from "../../types/symbol";
import {Thread} from "../../types/thread";
import {Modal} from "react-bootstrap";

export interface RightPanelType {
    onChange: (palette: PaletteType) => void,
    onDelete: (symbol: SymbolType) => void,
    palette: PaletteType
}

export const LeftPanel: FunctionComponent<RightPanelType> = ({palette = {}, onChange, onDelete}) => {
    const [modalOpened, setModalOpened] = useState(false);
    const [editSymbol, setEditSymbol] = useState<SymbolType>(symbolTypes[0]);

    function saveHandler(thread: Thread) {
        onChange({...palette, [editSymbol]: thread});
        setModalOpened(false)
    }

    function deleteHandler() {
        onDelete(editSymbol);
        setModalOpened(false)
    }

    function editHandler(symbol: SymbolType) {
        setEditSymbol(symbol);
        setModalOpened(true);
    }

    return (
        <Panel size={82} vertical={true} border={"Right"}>
            <Palette palette={palette} onDoubleClick={editHandler}/>
            <Modal show={modalOpened} onHide={() => setModalOpened(false)}>
                <Modal.Body>
                    <PaletteEdit thread={palette[editSymbol]}
                                 onSave={saveHandler}
                                 onCancel={() => setModalOpened(false)}
                                 onDelete={deleteHandler}/>
                </Modal.Body>
            </Modal>
        </Panel>
    )
}
