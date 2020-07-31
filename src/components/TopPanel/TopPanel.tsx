import React, {FunctionComponent, useContext} from "react";
import {Panel} from "../Panel/Panel";
import {stitchTypes} from "../../types/stitch";
import {DispatchContext, StoreContext} from "../Store";
import {ViewToolBar} from "../ViewToolBar/ViewToolBar";
import {BackToolBar, BackToolBarType} from "../BackPanel/BackToolBar";
import {Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import qx3 from '../../assets/qx3.svg';
import sx from '../../assets/sx.svg';
import half from '../../assets/half.svg';
import x from '../../assets/x.svg';
import qx from '../../assets/qx.svg';
import vx from '../../assets/vx.svg';
import hx from '../../assets/hx.svg';

export type TopPanelType = {} & BackToolBarType

export const TopPanel: FunctionComponent<TopPanelType> = ({onChangeColor, project, onChangePicture}) => {

    const {setStitchType} = useContext(DispatchContext);
    const {stitchType} = useContext(StoreContext);

    return (
        <Panel>
            <ButtonGroup className={"mr-1"}>
                {stitchTypes.map((type, index) =>
                    <Button size={"sm"}
                            active={type === stitchType}
                            key={index}
                            onClick={() => setStitchType(type)}>
                        {type === 'qx3' && <img src={qx3}/>}
                        {type === 'sx' && <img src={sx}/>}
                        {type === 'x' && <img src={x}/>}
                        {type === 'qx' && <img src={qx}/>}
                        {type === 'vx' && <img src={vx}/>}
                        {type === 'hx' && <img src={hx}/>}
                        {type === '\\' && <img src={half}/>}
                        {type === '/' && <img src={half} style={{transform:'rotate(90deg)'}}/>}
                    </Button>
                )}
            </ButtonGroup>
            <ViewToolBar/>
            <BackToolBar project={project}
                         onChangeColor={onChangeColor}
                         onChangePicture={onChangePicture}
            />
            <Link to={`/print/${project.id}`} target={'_blank'} component={Button}>Print</Link>
        </Panel>
    )
}
