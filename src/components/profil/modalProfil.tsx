import {Modal, Button} from '@mui/material';
import {useSnackbar} from 'notistack';

export default function ModalProfil(props: {
    modalOpen: boolean, setModalOpen: (open: boolean) => void
}) {

    const { enqueueSnackbar } = useSnackbar();

    const SendRecoveryData=() => {
        console.log("a");
        enqueueSnackbar("Demande envoyée",
            {variant: "success",
            });
        props.setModalOpen(false);
    };


    return (
        <Modal open={props.modalOpen} className='modal modal-form' onClose={() => props.setModalOpen(false)}>
            <div className='modal-content'>
                <h2>Envoyer une demande de récupération de données</h2>
                <p>
                    Collecter vos données peut nous prendre jusqu'à 30 jours. Vous recevrez un mail lorsque tout sera
                    prêts.
                </p>
                <div className='modal-form-buttons'>
                    <Button onClick={() => props.setModalOpen(false)} color='error' variant='contained'>Annuler</Button>
                    <Button onClick={SendRecoveryData} color='success' variant='contained'>Envoyer</Button>
                </div>
            </div>
        </Modal>
    )
}