import anchor from '../assets/anchor.json'
import dmc from '../assets/dmc.json'
import gamma from '../assets/gamma.json'
import maderia from '../assets/maderia.json'

export interface Thread {
    color: string;
    name: string;
    vendor: string;
}

export const vendors: { [key: string]: Thread[] } = {
    anchor: anchor.map(t => ({...t, vendor: 'anchor'})),
    dmc: dmc.map(t => ({...t, vendor: 'dmc'})),
    gamma: gamma.map(t => ({...t, vendor: 'gamma'})),
    maderia: maderia.map(t => ({...t, vendor: 'maderia'})),
} as any;
