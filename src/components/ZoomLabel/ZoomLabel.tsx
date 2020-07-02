import React, {useContext, useEffect, useState} from "react";
import {StoreContext} from "../Store";
import {zoomSettings} from "../../types/zoom";
import cls from 'classnames'
import './ZoomLabel.scss'

export const ZoomLabel = () => {
    const {zoom} = useContext(StoreContext);
    const label = (zoom.scale * 100 / zoomSettings.min).toFixed(0) + '%'
    const [active, setActive] = useState();
    useEffect(() => {
        clearTimeout(active);
        setActive(setTimeout(() => setActive(null), 1000));
    }, [zoom])

    return (
        <div className={cls('zoomLabel', {active: !!active})}>
            {label} | {zoom.scrollY} | {zoom.scrollX}
        </div>
    )
}
