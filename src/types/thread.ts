import anchor from '../assets/anchor.json'
import dmc from '../assets/dmc.json'
import gamma from '../assets/gamma.json'
import maderia from '../assets/maderia.json'

export interface Thread {
    color: string;
    code: string;
    vendor: string;
}

export const vendors: { [key: string]: Thread[] } = {anchor, dmc, gamma, maderia};
