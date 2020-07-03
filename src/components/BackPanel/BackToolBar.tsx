import React, {FunctionComponent, useRef, useState} from "react";
import {Button, ButtonGroup, Modal, Overlay} from "react-bootstrap";
import {ChromePicker, GithubPicker} from 'react-color';
import {backColors} from "../../types/backColors";
import {Picture, Project} from "../../types/project";
import {ImageEdit} from "../ImageEdit/ImageEdit";

export interface BackToolBarType {
    onChangeColor: (color: string) => void,
    onChangePicture: (picture?: Picture) => void,
    project: Project;
}

export const BackToolBar: FunctionComponent<BackToolBarType> = ({onChangeColor, project, onChangePicture}) => {

    const colorRef = useRef<any>(null);
    const colorCustomRef = useRef<any>(null);
    const [modal, setModal] = useState<'custom' | 'color' | 'image' | null>(null);

    return (
        <ButtonGroup>
            <Button onClick={() => setModal('color')} ref={colorRef} size={"sm"}>Color</Button>
            <Overlay target={colorRef.current}
                     placement={'bottom-start'}
                     rootClose={true}
                     show={modal === 'color'}
                     onHide={() => setModal(null)}>
                {(props: any) => (
                    <div {...props} style={{...props.style, top: 6,}}>
                        <GithubPicker colors={backColors} onChange={color => {
                            setModal(null);
                            onChangeColor(color.hex)
                        }}/>
                    </div>
                )}
            </Overlay>
            <Button onClick={() => setModal('custom')} ref={colorCustomRef} size={"sm"}>Custom Color</Button>
            <Overlay target={colorCustomRef.current}
                     rootClose={true}
                     onHide={() => setModal(null)}
                     placement={'bottom-start'}
                     show={modal === 'custom'}>
                {(props: any) => (
                    <div {...props} style={{...props.style, top: 6,}}>
                        <ChromePicker
                            color={project.color}
                            disableAlpha={true}
                            onChangeComplete={color => onChangeColor(color.hex)}/>
                    </div>
                )}
            </Overlay>
            <Button size={"sm"} onClick={() => setModal('image')}>Image</Button>
            <Modal show={modal === 'image'} onHide={() => setModal(null)}>
                <Modal.Body>
                    <ImageEdit project={project} onChange={picture => {
                        setModal(null);
                        onChangePicture(picture);
                    }}/>
                </Modal.Body>
            </Modal>
        </ButtonGroup>
    );
}
