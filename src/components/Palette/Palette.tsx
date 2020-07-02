import React, {FunctionComponent, useCallback, useContext} from "react";
import './Palette.scss'
import {PaletteType} from "../../types/paletteType";
import cls from 'classnames'
import {colorService} from "../../services/colorService";
import {DispatchContext, StateContext} from "../Store";
import {SymbolType, symbolTypes} from "../../types/symbol";
import {Thread} from "../../types/thread";

export interface PalettePropsType {
    onDoubleClick?: (symbol: SymbolType) => void,
    palette: PaletteType
}

export const Palette: FunctionComponent<PalettePropsType> = ({palette, onDoubleClick}) => {
    const {symbol: selectedSymbol} = useContext(StateContext);
    const {setSymbol} = useContext(DispatchContext);
    return (
        <div className="Palette">
            {symbolTypes
                .sort((a, b) => {
                    const threadA = palette[a];
                    const threadB = palette[b];
                    if (!!threadA && !!threadB || !threadA && !threadB) return a > b ? -1 : 1;
                    return threadA ? -1 : 1;
                })
                .map((symbol, index) => {
                        const thread: Thread | undefined = palette[symbol];
                        const contrastColor = thread ? colorService.strRgbContrast(thread.color) : 'black';
                        const style = {borderColor: contrastColor, color: contrastColor, backgroundColor: thread?.color}
                        return (
                            <div className={cls('colorBox', {selected: selectedSymbol == symbol})}
                                 key={index}
                                 style={style}
                                 title={thread && (thread.vendor + ' ' + thread.name)}
                                 onDoubleClick={e => onDoubleClick && onDoubleClick(symbol)}
                                 onContextMenu={e => {
                                     e.preventDefault();
                                     onDoubleClick && onDoubleClick(symbol)
                                 }}
                                 onClick={e => setSymbol(symbol)}>
                                {symbol}
                            </div>
                        )
                    }
                )}
        </div>
    )
}
