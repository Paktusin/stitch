import React, {FunctionComponent, useRef, useState} from "react";
import {Button, ButtonGroup, Card, Modal, Overlay} from "react-bootstrap";
import {ChromePicker, GithubPicker} from 'react-color';
import {backColors} from "../../types/backColors";

export interface BackToolBarType {
    onChangeColor: (color: string) => void
}

export const BackToolBar: FunctionComponent<BackToolBarType> = ({onChangeColor}) => {

    const colorRef = useRef<any>(null);
    const colorCustomRef = useRef<any>(null);
    const [modal, setModal] = useState<'custom' | 'color' | 'image' | null>(null);
    const [customColor, setCustomColor] = useState(backColors[1]);

    return (
        <ButtonGroup>
            <Button onClick={() => setModal('color')} ref={colorRef} size={"sm"}>Color</Button>
            <Overlay target={colorRef.current} placement={'bottom-start'} show={modal === 'color'}>
                {(props: any) => (
                    <div {...props} style={{...props.style, top: 6,}}>
                        <Card>
                            <GithubPicker colors={backColors} onChange={color => {
                                setModal(null);
                                onChangeColor(color.hex)
                            }}/>
                            <Card.Footer>
                                <Button size={"sm"} onClick={() => setModal(null)}>Cancel
                                </Button>
                            </Card.Footer>
                        </Card>
                    </div>
                )}
            </Overlay>
            <Button onClick={() => setModal('custom')} ref={colorCustomRef} size={"sm"}>Custom Color</Button>
            <Overlay target={colorCustomRef.current} placement={'bottom-start'} show={modal === 'custom'}>
                {(props: any) => (
                    <div {...props} style={{...props.style, top: 6,}}>
                        <Card>
                            <ChromePicker
                                color={customColor}
                                disableAlpha={true}
                                onChange={color => {
                                    setCustomColor(color.hex);
                                }}/>
                            <Card.Footer>
                                <ButtonGroup>
                                    <Button size={"sm"} onClick={() => {
                                        onChangeColor(customColor);
                                        setModal(null);
                                    }}>Ok</Button>
                                    <Button size={"sm"} onClick={() => setModal(null)}>Cancel</Button>
                                </ButtonGroup>
                            </Card.Footer>
                        </Card>
                    </div>
                )}
            </Overlay>
            <Button size={"sm"} onClick={() => setModal('image')}>Image</Button>
            <Modal show={modal === 'image'} onHide={() => setModal(null)}>
                <Modal.Body>

                </Modal.Body>
            </Modal>
        </ButtonGroup>
    );
}
