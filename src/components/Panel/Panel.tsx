import React, {FunctionComponent} from 'react';
import './Panel.scss'
import cls from 'classnames';

export interface PanelType {
    vertical?: boolean;
    size?: number;
    border?: 'Left' | 'Right' | 'Top' | 'Bottom';
}

export const Panel: FunctionComponent<PanelType> =
    ({
         vertical,
         children,
         size,
         border = 'Bottom'
     }) => {
        const style: any = {};
        if (size) {
            style[vertical ? 'width' : 'height'] = size;
        }
        if (border) {
            style['border' + border] = '1px solid #cecece'
        }
        return (
            <div style={style} className={cls({vertical}, 'Panel')}>{children}</div>
        )
    }

