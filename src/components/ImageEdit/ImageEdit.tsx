import React, {FunctionComponent, useCallback, useEffect, useMemo, useState} from "react";
import './ImageEdit.scss'
import {Picture, Project} from "../../types/project";
import {Button, Form} from "react-bootstrap";

export interface ImageEditProps {
    onChange: (picture?: Picture) => void;
    project: Project
}

export const ImageEdit: FunctionComponent<ImageEditProps> = ({project, onChange}) => {

    const newPicture = {height: 0, width: 0, left: 0, top: 0, sWidth: 0, sHeight: 0, opacity: .5};
    const [picture, setPicture] = useState<Picture>(newPicture);
    const [lock, setLock] = useState(true)
    const aspect = useMemo(() => picture.width / picture.height, [picture])
    const maxSize = useMemo(() => ({
        width: aspect < 1 ? project.height : Math.floor(project.width / aspect),
        height: aspect >= 1 ? project.width : Math.floor(aspect * project.height)
    }), [aspect, picture])

    function fileChange(e: any) {
        const {target: {files: [file]}} = e;
        if (file as File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    const image = new Image();
                    image.onload = () => {
                        if (e.target) {
                            const aspect = image.width / image.height;
                            setPicture({
                                ...picture,
                                data: e.target.result as string,
                                left: 0, top: 0, height: image.height, width: image.width,
                                sHeight: aspect >= 1 ? project.width : Math.floor(aspect * project.height),
                                sWidth: aspect < 1 ? project.height : Math.floor(project.width / aspect),
                            })
                        }
                    }
                    image.src = e.target.result as string;
                }
            }
            reader.readAsDataURL(file);
        }
    }

    function changeSize(size: number, prop: string) {
        const newSize = {[prop]: size};
        if (lock) {
            newSize[(prop === 'sWidth' ? 'sHeight' : 'sWidth')] = prop === 'sWidth' ? Math.floor(size / aspect) : Math.floor(size * aspect);
        }
        setPicture({...picture, ...newSize})
    }

    useEffect(() => {
        if (project.picture) {
            setPicture(project.picture);
        }
    }, [project.picture])

    return (
        <div className={'ImageEdit'}>
            {picture.data && <img src={picture.data}/>}
            <Form>
                <Form.Group>
                    <Form.File accept="image/*" label="Image" onChange={fileChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Check label={'Lock aspect ratio'}
                                checked={lock}
                                onChange={() => setLock(!lock)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Height</Form.Label>
                    <Form.Control type={'number'}
                                  min={0}
                                  max={maxSize.height}
                                  value={picture.sHeight}
                                  onChange={e => changeSize(parseInt(e.target.value), 'sHeight')}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Width</Form.Label>
                    <Form.Control type={'number'}
                                  min={0}
                                  max={maxSize.width}
                                  value={picture.sWidth}
                                  onChange={e => changeSize(parseInt(e.target.value), 'sWidth')}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>offset X</Form.Label>
                    <Form.Control type={'number'}
                                  min={0}
                                  max={maxSize.width}
                                  value={picture.left}
                                  onChange={e => setPicture({...picture, left: parseInt(e.target.value)})}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>offset Y</Form.Label>
                    <Form.Control type={'number'}
                                  min={0}
                                  max={maxSize.height}
                                  value={picture.top}
                                  onChange={e => setPicture({...picture, top: parseInt(e.target.value)})}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Opacity %</Form.Label>
                    <Form.Control type={'number'}
                                  min={0}
                                  max={100}
                                  value={Math.floor(picture.opacity * 100)}
                                  onChange={e => setPicture({...picture, opacity: parseInt(e.target.value) / 100})}/>
                </Form.Group>
            </Form>
            <Button onClick={() => onChange({...picture})}>Save</Button>
        </div>
    )
}
