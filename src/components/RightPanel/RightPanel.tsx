import React, {FunctionComponent, useContext, useState} from "react";
import {Panel} from "../Panel/Panel";
import {PanelButton} from "../PanleButton/PanelButton";
import {Palette} from "../Palette/Palette";
import {PaletteType} from "../../types/paletteType";
import {Modal} from "../Modal/Modal";
import {PaletteEdit} from "../PaleteEdit/PaletteEdit";
import {DispatchContext, StateContext} from "../Store";

export interface RightPanelType {
    onChange: (palette: PaletteType[]) => void,
    palette: PaletteType[]
}

export const RightPanel: FunctionComponent<RightPanelType> = ({palette = [], onChange}) => {
    const [modalOpened, setModalOpened] = useState(false);
    const [editIndex, setEditIndex] = useState<number>();

    function saveHandler(paletteItem?: PaletteType) {
        if (paletteItem) {
            if (editIndex !== undefined) {
                const newPalette = [...palette];
                newPalette.splice(editIndex, 1, paletteItem)
                onChange(newPalette);
            } else {
                onChange([...palette, paletteItem]);
            }
        }
        setModalOpened(false)
    }

    function editHandler(paletteItem?: PaletteType, index?: number) {
        setEditIndex(index);
        setModalOpened(true);
    }

    const editPaletteItem = palette[editIndex || -1];

    return (
        <Panel size={128} vertical={true} border={"Left"}>
            <PanelButton onClick={e => editHandler()}>+</PanelButton>
            <Palette palette={palette} onClick={editHandler}/>
            <Modal opened={modalOpened} onBackDrop={() => setModalOpened(false)}>
                <PaletteEdit paletteItem={editPaletteItem} onSave={saveHandler}/>
            </Modal>
        </Panel>
    )
}
