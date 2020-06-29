import React, {useContext, useEffect, useState} from "react";
import {StateContext} from "../Store";
import {zoomSettings} from "../../types/zoom";
import cls from 'classnames'
import './ZoomLabel.scss'

export const ZoomLabel = () => {
    const {zoom} = useContext(StateContext);
    const label = ((zoom.scale - zoomSettings.min) * 100 / (1 - zoomSettings.min)).toFixed(0) + '%'
    const [active, setActive] = useState();
    useEffect(() => {
        setActive(setTimeout(() => setActive(null), 1000));
    }, [zoom.scale])

    return (
        <div className={cls('zoomLabel', {active: !!active})}>{label}</div>
    )
}
