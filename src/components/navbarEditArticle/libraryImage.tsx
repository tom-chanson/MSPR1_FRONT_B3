import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { RequestHelperAuth } from "../../helpers/request";
import Button from "@mui/material/Button";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../../styles/libraryImage.css';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import TextField from "@mui/material/TextField";
import { ImagePost, ImagePostReponse } from "../../interface";




export default function LibraryImage(props: {open: boolean, setOpen: (open: boolean) => void, addInNewLine: (text: string, cursorPositionAdd: number) => void}) {
    const [images, setImages] = useState<string[]>([]);
    const [modalTitleOpen, setModalTitleOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const authHeader = useAuthHeader();

    useEffect(() => {
    if (loading && authHeader) {
        RequestHelperAuth<string[]>('GET', '/image', authHeader).then((response) => {
            if (response.status === 200) {
                setImages(response.data);
            } else {
                console.warn(response);
            }
            setLoading(false);
        }).catch((error) => {
            console.warn(error);
            setLoading(false);
        });
    }});

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
        if (authHeader && fileInput && title) {
            const fileRename = new File([fileInput], title, {type: fileInput.type});
            const formData: ImagePost = {
                image: fileRename
            }
            RequestHelperAuth<ImagePostReponse>('POST', '/image', authHeader, formData).then((response) => {
                if (response.status === 200) {
                    setImages([...images, response.data.image_url]);
                    setModalTitleOpen(false);
                    props.setOpen(false);
                    props.addInNewLine('![](' + response.data.image_url + ')' , 3);
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
                    <input type="file" className="visuallyHiddenInput" onChange={addImage} accept="image/*" required/>
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