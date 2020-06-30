import React, {FunctionComponent} from 'react'

export interface PanelButtonType {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const PanelButton: FunctionComponent<PanelButtonType> = ({children, onClick}) => {
    return (
        <button onClick={onClick}>{children}</button>
    )
}
