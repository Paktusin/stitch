import React, {FunctionComponent, useContext, useEffect, useMemo, useState} from "react";
import {Panel} from "../Panel/Panel";
import {PanelButton} from "../PanleButton/PanelButton";
import {Palette} from "../Palette/Palette";
import {PaletteType} from "../../types/paletteType";
import {Modal} from "../Modal/Modal";
import {PaletteEdit} from "../PaleteEdit/PaletteEdit";
import {DispatchContext, StateContext} from "../Store";

export interface RightPanelType {
    onChange: (palette: PaletteType[]) => void,
    onDelete: (palette: PaletteType[], deletedItem: PaletteType) => void,
    palette: PaletteType[]
}

export const RightPanel: FunctionComponent<RightPanelType> = ({palette = [], onChange, onDelete}) => {
    const [modalOpened, setModalOpened] = useState(false);
    const [editIndex, setEditIndex] = useState<number>();
    const {setPaletteItem} = useContext(DispatchContext);
    const {paletteItem} = useContext(StateContext);

    function saveHandler(paletteItem: PaletteType) {
        if (editIndex !== undefined) {
            const newPalette = [...palette];
            newPalette.splice(editIndex, 1, paletteItem)
            onChange(newPalette);
        } else {
            onChange([...palette, paletteItem]);
        }
        setModalOpened(false)
    }

    function deleteHandler() {
        if (editIndex !== undefined) {
            const newPalette = [...palette];
            const deletedItem = newPalette[editIndex];
            newPalette.splice(editIndex, 1)
            onDelete(newPalette, deletedItem);
        }
        setModalOpened(false)
    }

    function editHandler(paletteItem?: PaletteType, index?: number) {
        setEditIndex(index);
        setModalOpened(true);
    }

    const editPaletteItem = useMemo(() => palette[editIndex !== undefined ? editIndex : -1], [editIndex, palette]);

    useEffect(() => {
        if (palette.length && !paletteItem) {
            setPaletteItem(palette[0])
        }
    }, [palette])

    return (
        <Panel size={128} vertical={true} border={"Left"}>
            <PanelButton onClick={e => editHandler()}>+</PanelButton>
            <Palette selected={paletteItem} palette={palette} onClick={setPaletteItem} onDoubleClick={editHandler}/>
            <Modal opened={modalOpened} onBackDrop={() => setModalOpened(false)}>
                <PaletteEdit edit={editIndex !== -1}
                             paletteItem={editPaletteItem}
                             onSave={saveHandler}
                             onCancel={() => setModalOpened(false)}
                             onDelete={deleteHandler}
                />
            </Modal>
        </Panel>
    )
}
