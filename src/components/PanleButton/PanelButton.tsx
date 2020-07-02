import React, {FunctionComponent} from 'react'
import cls from 'classnames';
import './PanelButton.scss'

export interface PanelButtonType {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    active?: boolean
}

export const PanelButton: FunctionComponent<PanelButtonType> = ({children, onClick, active = false}) => {
    return (
        <button className={cls('PanelButton', {active})} onClick={onClick}>{children}</button>
    )
}
