import {Stitch} from "./stitch";
import {Thread} from "./thread";
import {SymbolType} from "./symbol";

export type Cell = {
    thread: Thread;
    value: Stitch;
    symbol: SymbolType;
}
