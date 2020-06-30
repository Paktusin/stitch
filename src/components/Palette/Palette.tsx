import React, {FunctionComponent, useCallback} from "react";
import './Palette.scss'
import {PaletteType} from "../../types/paletteType";
import cls from 'classnames'

export interface PalettePropsType {
    onClick?: (paletteItem: PaletteType, index: number) => void,
    onDoubleClick?: (paletteItem: PaletteType, index: number) => void,
    palette: PaletteType[]
    selected?: PaletteType
}

export const Palette: FunctionComponent<PalettePropsType> = ({palette, onClick, selected, onDoubleClick}) => {

    const isSelected = useCallback((paletteItem: PaletteType) => {
        return selected?.thread?.name === paletteItem.thread?.name && paletteItem.thread?.vendor === selected?.thread?.vendor
    }, [selected])

    return (
        <div className="Palette">
            {palette.map((paletteItem, index) =>
                <div className={cls('colorBox', {selected: isSelected(paletteItem)})}
                     key={index}
                     style={{backgroundColor: paletteItem.thread?.color}}
                     title={paletteItem.thread?.name}
                     onDoubleClick={e => onDoubleClick && onDoubleClick(paletteItem, index)}
                     onClick={e => onClick && onClick(paletteItem, index)}>
                </div>
            )}
        </div>
    )
}
