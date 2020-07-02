import React, {FunctionComponent, useContext, useEffect, useMemo, useState} from "react";
import {Panel} from "../Panel/Panel";
import {PanelButton} from "../PanleButton/PanelButton";
import {Palette} from "../Palette/Palette";
import {PaletteType} from "../../types/paletteType";
import {Modal} from "../Modal/Modal";
import {PaletteEdit} from "../PaleteEdit/PaletteEdit";
import {DispatchContext, StoreContext} from "../Store";
import {SymbolType, symbolTypes} from "../../types/symbol";
import {Thread} from "../../types/thread";

export interface RightPanelType {
    onChange: (palette: PaletteType) => void,
    onDelete: (symbol: SymbolType) => void,
    palette: PaletteType
}

export const RightPanel: FunctionComponent<RightPanelType> = ({palette = {}, onChange, onDelete}) => {
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
        <Panel size={128} vertical={true} border={"Left"}>
            <Palette palette={palette} onDoubleClick={editHandler}/>
            <Modal opened={modalOpened} onBackDrop={() => setModalOpened(false)}>
                <PaletteEdit thread={palette[editSymbol]}
                             onSave={saveHandler}
                             onCancel={() => setModalOpened(false)}
                             onDelete={deleteHandler}
                />
            </Modal>
        </Panel>
    )
}
