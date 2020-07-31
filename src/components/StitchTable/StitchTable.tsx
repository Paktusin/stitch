import React, {FunctionComponent} from "react";
import {PaletteType} from "../../types/paletteType";
import {SymbolType} from "../../types/symbol";

export interface StitchTableProps {
    symbols: SymbolType[]
    palette: PaletteType
}

export const StitchTable: FunctionComponent<StitchTableProps> = ({symbols, palette}) => {

    return (
        <table className="table table-bordered">
            <thead>
            <tr>
                <th>Sym</th>
                <th>Vendor</th>
                <th>Number</th>
                <th>Threads</th>
            </tr>
            </thead>
            <tbody>
            {symbols.map((symbol, index) => {
                const thread = palette[symbol as any];
                return (<tr key={index}>
                    <td>{symbol}</td>
                    <td>{thread.vendor}</td>
                    <td>{thread.name}</td>
                    <td>2</td>
                </tr>);
            })}
            </tbody>
        </table>
    )
}
