import React, {FunctionComponent, useRef} from "react";
import './Modal.scss'

export interface ModalType {
    opened: boolean;
    onClose?: () => void;
    onBackDrop?: () => void;
}

export const Modal: FunctionComponent<ModalType> = ({opened = false, onClose, children, onBackDrop}) => {

    const backdropRef = useRef(document.createElement('div'))

    function clickHandler(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === backdropRef.current) {
            onBackDrop && onBackDrop()
        }
    }

    if (!opened) return null;
    return (
        <div className="Modal" onClick={clickHandler} ref={backdropRef}>
            <div className="content">{children}</div>
        </div>
    )
}
