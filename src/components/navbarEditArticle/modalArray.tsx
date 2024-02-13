import { Modal, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { addInNewLine } from "../../utils/editArticle"
import {textArray} from "../../utils/editArticle"

export default function ModalArray(props: {
    setMarkdownText: (text: string) => void,
    modalOpen: boolean, setModalOpen: (open: boolean) => void,
    textareaRef: React.RefObject<HTMLTextAreaElement>}) 
    {
    const [numberLine, setNumberLine] = useState<number|''>(1);
    const [numberColumn, setNumberColumn] = useState<number|''>(1);

    const handleFormArraySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.setModalOpen(false);
        addInNewLine(textArray(numberLine as number, numberColumn as number), -1, props.textareaRef, props.setMarkdownText);
    }

    const minNumberLine = 1;
    const maxNumberLine = 15;

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, setNumber: React.Dispatch<React.SetStateAction<number|''>>) => {
        if (e.target.value === '') {
            setNumber('');
        } else{
            const number = parseInt(e.target.value);
            if (number < minNumberLine) {
                setNumber(minNumberLine);
            } else if (number > maxNumberLine) {
                setNumber(maxNumberLine);
            } else {
                setNumber(number);
            }
        }
    }
        
    return (
        <Modal open={props.modalOpen} className='modal modal-form' onClose={() => props.setModalOpen(false)}>
            <form onSubmit={handleFormArraySubmit} className='modal-content'>
                <h2>Insérer un tableau</h2>
                <div className='modal-form-input'>
                <TextField label='Nombre de lignes' type='number' required value={numberLine} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumberChange(e, setNumberLine)} autoFocus/>
                </div>
                <div className='modal-form-input'>
                <TextField label='Nombre de colonnes' type='number' required value={numberColumn} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumberChange(e, setNumberColumn)} />
                </div>
                <div className='modal-form-buttons'>
                    <Button type='submit' color='success' variant="contained">Valider</Button>
                    <Button onClick={() => props.setModalOpen(false)} color='error' variant="contained">Annuler</Button>
                </div>
            </form>
        </Modal>
    )
}