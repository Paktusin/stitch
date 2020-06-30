import React, {FunctionComponent} from "react";
import './Palette'
import {PaletteType} from "../../types/paletteType";
import cls from 'classnames'

export interface PalettePropsType {
    onClick?: (paletteItem: PaletteType, index: number) => void,
    palette: PaletteType[]
    selected?: PaletteType
}

export const Palette: FunctionComponent<PalettePropsType> = ({palette, onClick, selected}) => {

    return (
        <div className="Palette">
            {palette.map((paletteItem, index) =>
                <div className={cls('colorBox', {selected: selected?.thread?.code === paletteItem.thread?.code})}
                     key={index}
                     style={{backgroundColor: paletteItem.thread?.color}}
                     onClick={e => onClick && onClick(paletteItem, index)}>
                    {paletteItem.symbol}
                </div>
            )}
        </div>
    )
}
