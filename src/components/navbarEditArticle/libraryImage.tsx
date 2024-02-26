import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@mui/material/Modal";
import { useEffect, useRef, useState } from "react";
import { RequestHelperAuth, RequestHelperAuthImage } from "../../helpers/request";
import Button from "@mui/material/Button";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../../styles/libraryImage.css';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import TextField from "@mui/material/TextField";
import { ImagePostBiblioteque, ImagePostReponse, Image } from "../../interface";
import { route_api } from "../../constants";




export default function LibraryImage(props: {open: boolean, setOpen: (open: boolean) => void, addInNewLine: (text: string, cursorPositionAdd: number) => void}) {
    const [images, setImages] = useState<string[]>([]);
    const [modalTitleOpen, setModalTitleOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const authHeader = useAuthHeader();

    const refInputFile = useRef<HTMLInputElement>(null);

    useEffect(() => {
    if (loading && authHeader) {
        RequestHelperAuth<Image[]>('GET', route_api.library_image, authHeader).then((response) => {
            const tempImages: string[] = [];
            if (response.status === 200) {
                response.data.forEach((image: Image) => {
                    tempImages.push(image.image_url);
                });
                setImages(tempImages);
            } else {
                console.warn(response);
            }
            setLoading(false);
        }).catch((error) => {
            console.warn(error);
            setLoading(false);
        });
    }
});

    const [fileInput, setFileInput] = useState<File | null>(null);
    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setFileInput(file);
            setTitle(file.name);
            setModalTitleOpen(true);
            console.log(file);
        } else {
            console.warn('No file');
            setFileInput(null);
        }
    }

    const [title, setTitle] = useState('');
    const FormSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log('submit');
        e.preventDefault();
        if (authHeader && fileInput && title && refInputFile.current!.files) {
            const file = refInputFile.current!.files[0];
            const formData = new FormData();
            formData.set('image', file);
            console.log(formData);
            RequestHelperAuthImage<ImagePostReponse>('POST', route_api.post_image, authHeader, formData).then((response) => {
                if (response.status === 200) {
                    const dataImageBilblio: ImagePostBiblioteque = {
                        image_url: response.data.url,
                        titre: title
                    }
                    RequestHelperAuth<ImagePostBiblioteque>('POST', route_api.post_image_biblioteque, authHeader, dataImageBilblio).then((response_image) => {
                        if (response_image.status === 200) {
                            setImages([...images, response.data.url]);
                            setModalTitleOpen(false);
                            props.setOpen(false);
                            props.addInNewLine('![](' + response.data.url + ')' , 3);
                        } else {
                            console.warn(response_image);
                        }
                    }).catch((error) => {
                        console.warn(error);
                    });
                } else {
                    console.warn(response);
                }
            }).catch((error) => {
                console.warn(error);
            });
            
        }
    }


    const imageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.currentTarget.tagName === 'IMG') {
            const image = e.currentTarget as HTMLImageElement;
            if (image.src) {
                props.addInNewLine('![](' + image.src + ')' , 3);
                props.setOpen(false);
            }
        }
    }

    return (
        <Modal open={props.open} className='modal modal-libray' onClose={() => props.setOpen(false)}>
            <div className="modal-content">
                <h2>Bibliothèque d'image</h2>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Ajouter une/des image(s)
                    <input type="file" className="visuallyHiddenInput" onChange={addImage} accept="image/*" required ref={refInputFile}/>
                    </Button>
                    <Modal open={modalTitleOpen} onClose={() => setModalTitleOpen(false)} className='modal modal-form'>
                        <div className='modal-content'>
                            <h2>Titre de l'image</h2>
                            <div className='modal-form-input'>
                                <TextField type='text' required autoFocus name="title" />
                            </div>
                            <div className='modal-form-button'>
                                <Button variant='contained' onClick={(e) => FormSubmit(e)} type='submit' color='primary' startIcon={<FontAwesomeIcon icon={faPlus}/>}>Ajouter</Button>
                            </div>
                        </div>
                    </Modal>
                <div className='library-image'>
                {loading ? <div className='loading'><AiOutlineLoading3Quarters className='loading'/></div> : null}
                    <div className='list-image'>
                    {images.map((image, index) => {
                        return (
                            <div key={index} className='image'>
                                <img src={image} alt={image} onClick={imageClick}/>
                            </div>
                        )
                    })}
                    </div>
                </div>
            </div>
        </Modal>
    )
}