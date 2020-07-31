export const paths: { [key: string]: { [key: string]: { path: number[][], symbol: number[][] } } } =
    {
        'qx3': {
            'tltrbr': {path: [[1, 0], [1, 1], [0.75, 1], [0, .25], [0, 0]], symbol: [[.75, .5]]},
            'bltltr': {path: [[0, 0], [1, 0], [1, .25], [.25, 1], [0, 1]], symbol: [[.4, .5]]},
            'tlblbr': {path: [[0, 1], [0, 0], [.25, 0], [1, .75], [1, 1]], symbol: [[.25, .75]]},
            'blbrtr': {path: [[1, 1], [1, 0], [.75, 0], [0, .75], [0, 1]], symbol: [[.6, .75]]}
        },
        'qx': {
            'tr': {path: [[1, 0], [1, .75], [.25, 0]], symbol: [[.8, .35]]},
            'tl': {path: [[0, 0], [.75, 0], [0, .75]], symbol: [[.2, .35]]},
            'bl': {path: [[0, 1], [0, .25], [.75, 1]], symbol: [[.2, .95]]},
            'br': {path: [[1, 1], [.25, 1], [1, .25]], symbol: [[.8, .95]]}
        },
        'sx': {
            'tr': {path: [[1, 0], [1, .5], [.5, .5], [.5, 0]], symbol: [[.8, .35]]},
            'tl': {path: [[0, 0], [.5, 0], [.5, .5], [0, .5]], symbol: [[.2, .35]]},
            'bl': {path: [[0, 1], [0, .5], [.5, .5], [.5, 1]], symbol: [[.2, .95]]},
            'br': {path: [[1, 1], [.5, 1], [.5, .5], [1, .5]], symbol: [[.8, .95]]}
        },
        '\\': {
            'tlbr': {path: [[0, 0], [0, .25], [.75, 1], [1, 1], [1, .75], [.25, 0]], symbol: [[.5, .75]]}
        },
        '/': {
            'bltr': {path: [[1, 0], [1, .25], [.25, 1], [0, 1], [0, .75], [.75, 0]], symbol: [[.5, .75]]}
        },
        'x': {
            'trtrblbr': {path: [[0, 0], [0, 1], [1, 1], [1, 0]], symbol: [[.5, .7]]}
        },
        'vx': {
            'tlbl': {path: [[0, 0], [.5, 0], [.5, 1], [0, 1]], symbol: [[.25, .7]]},
            'trbr': {path: [[.5, 0], [1, 0], [1, 1], [.5, 1]], symbol: [[.75, .7]]}
        },
        'hx': {
            'trtl': {path: [[0, 0], [1, 0], [1, .5], [0, .5]], symbol: [[.5, .35]]},
            'brbl': {path: [[0, .5], [1, .5], [1, 1], [0, 1]], symbol: [[.5, .9]]}
        }
    };
