import React, {FunctionComponent, useCallback} from "react";
import './Palette.scss'
import {PaletteType} from "../../types/paletteType";
import cls from 'classnames'
import {colorService} from "../../services/colorService";

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
            {palette.map((paletteItem, index) => {
                    const contrastColor = colorService.strRgbContrast(paletteItem.thread?.color);
                    const title = paletteItem.thread?.vendor + ' ' + paletteItem.thread?.name;
                    return (
                        <div className={cls('colorBox', {selected: isSelected(paletteItem)})}
                             key={index}
                             style={{backgroundColor: paletteItem.thread?.color, borderColor: contrastColor}}
                             title={title}
                             onDoubleClick={e => onDoubleClick && onDoubleClick(paletteItem, index)}
                             onClick={e => onClick && onClick(paletteItem, index)}>
                            <span style={{color: contrastColor}}>{paletteItem.symbol}</span>
                        </div>
                    )
                }
            )}
        </div>
    )
}
