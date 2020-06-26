import React, {FunctionComponent} from 'react';
import './Panel.scss'
import cls from 'classnames';

export interface PanelType {
    vertical?: boolean;
}

export const Panel: FunctionComponent<PanelType> = ({vertical, children}) => {
    return (
        <div className={cls({vertical}, 'Panel')}>{children}</div>
    )
}

