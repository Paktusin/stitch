import React, {useRef} from "react";

export const Test = () => {
    const ref = useRef<HTMLDivElement>(document.createElement('div'));
    let clicked = false;

    function mouseDownHandler(res: boolean) {
        clicked = res;
    }

    function mouseMoveHandler() {
        console.log(clicked);
        if (ref.current) {
            ref.current.innerHTML = clicked + '';
        }
    }

    return (
        <div
            style={{width: '100vw', height: '100vh'}}
            onMouseDown={e => mouseDownHandler(true)}
            onMouseMove={mouseMoveHandler}
            onMouseUp={e => mouseDownHandler(false)}>
            {clicked.toString()}
            <div ref={ref}/>
        </div>
    );
}
