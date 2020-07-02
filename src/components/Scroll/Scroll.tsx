import React, {FunctionComponent, useEffect, useRef} from "react";
import './Scroll.scss'
import cls from 'classnames'

export interface ScrollPropsType {
    horizontal?: boolean;
    size?: number;
    scroll: number;
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export const Scroll: FunctionComponent<ScrollPropsType> =
    ({horizontal = false, size = 0, onScroll, scroll}) => {
        const ref = useRef<HTMLDivElement>(document.createElement('div'));
        const overflow = ref.current ? ref.current[horizontal ? 'offsetWidth' : 'offsetHeight'] + size : 0;

        useEffect(() => {
            ref.current[!horizontal ? 'scrollTop' : 'scrollLeft'] = scroll;
        }, [scroll])
        return (

            <div ref={ref} className={cls('scroll', {horizontal})} onScroll={onScroll}>
                <div className="overflow" style={{[horizontal ? 'width' : 'height']: overflow}}/>
            </div>
        )
    }
