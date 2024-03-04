import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@mui/material/Modal";
import { useEffect, useRef, useState } from "react";
import {
  RequestHelperAuth,
  RequestHelperAuthImage,
  useAuth,
} from "../../helpers/request";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "../../styles/libraryImage.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TextField from "@mui/material/TextField";
import { ImagePostBiblioteque, ImagePostReponse, Image } from "../../interface";
import { route_api } from "../../constants";
import { useSnackbar } from "notistack";

export default function LibraryImage(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addInNewLine: (text: string, cursorPositionAdd: number) => void;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [modalTitleOpen, setModalTitleOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageSendInProgess, setImageSendInProgess] = useState(false);
  const authHeader = useAuth();

  const refInputFile = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const openSnackbar = (message: string, type: "success" | "error") => {
    enqueueSnackbar(message, { variant: type });
  };

  useEffect(() => {
    if (loading && authHeader) {
      RequestHelperAuth<Image[]>("GET", route_api.library_image, authHeader)
        .then((response) => {
          const tempImages: string[] = [];
          if (response.status === 200) {
            response.data.forEach((image: Image) => {
              tempImages.push(image.image_url);
            });
            setImages(tempImages);
          } else {
            openSnackbar("Erreur lors du chargement des images", "error");
          }
          setLoading(false);
        })
        .catch((error) => {
          openSnackbar("Erreur lors du chargement des images", "error");
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
      openSnackbar("Aucune image sélectionnée", "error");
      setFileInput(null);
    }
  };

  const [title, setTitle] = useState("");
  const FormSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (authHeader && fileInput && title && refInputFile.current!.files) {
      setImageSendInProgess(true);
      console.log("submit start");
      const file = refInputFile.current!.files[0];
      const formData = new FormData();
      formData.set("image", file);
      console.log(formData);
      RequestHelperAuthImage<ImagePostReponse>(
        "POST",
        route_api.post_image,
        authHeader,
        formData
      )
        .then((response) => {
          if (response.status === 200) {
            const dataImageBilblio: ImagePostBiblioteque = {
              image_url: response.data.url,
              titre: title,
            };
            RequestHelperAuth<ImagePostBiblioteque>(
              "POST",
              route_api.post_image_biblioteque,
              authHeader,
              dataImageBilblio
            )
              .then((response_image) => {
                setImageSendInProgess(false);
                if (response_image.status === 200) {
                  setImages([...images, response.data.url]);
                  setModalTitleOpen(false);
                  props.setOpen(false);
                  props.addInNewLine("![](" + response.data.url + ")", 3);
                  openSnackbar("Image ajoutée avec succès", "success");
                } else {
                  console.error(response_image);
                  openSnackbar("Erreur lors de l'ajout de l'image", "error");
                }
              })
              .catch((error) => {
                console.error(error);
                openSnackbar("Erreur lors de l'ajout de l'image", "error");
                setImageSendInProgess(false);
              });
          } else {
            console.error(response);
            openSnackbar("Erreur lors de l'ajout de l'image", "error");
            setImageSendInProgess(false);
          }
        })
        .catch((error) => {
          console.error(error);
          openSnackbar("Erreur lors de l'ajout de l'image", "error");
          setImageSendInProgess(false);
        });
    }
  };

  const imageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.tagName === "IMG") {
      const image = e.currentTarget as HTMLImageElement;
      if (image.src) {
        props.addInNewLine("![](" + image.src + ")", 3);
        props.setOpen(false);
      }
    }
  };

  return (
    <Modal
      open={props.open}
      className="modal modal-libray"
      onClose={() => props.setOpen(false)}
    >
      <div className="modal-content">
        <h2>Bibliothèque d'image</h2>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Ajouter une/des image(s)
          <input
            type="file"
            className="visuallyHiddenInput"
            onChange={addImage}
            accept="image/*"
            required
            ref={refInputFile}
          />
        </Button>
        <Modal
          open={modalTitleOpen}
          onClose={() => setModalTitleOpen(false)}
          className="modal modal-form"
        >
          <div className="modal-content">
            <h2>Titre de l'image</h2>
            <div className="modal-form-input">
              <TextField type="text" required autoFocus name="title" />
            </div>
            <div className="modal-form-button">
              <Button
                variant="contained"
                onClick={(e) => FormSubmit(e)}
                type="submit"
                color="primary"
                startIcon={
                  imageSendInProgess ? (
                    <AiOutlineLoading3Quarters className="loading" />
                  ) : (
                    <FontAwesomeIcon icon={faPlus} />
                  )
                }
                disabled={!title || imageSendInProgess}
              >
                Ajouter
              </Button>
            </div>
          </div>
        </Modal>
        <div className="library-image">
          {loading ? (
            <div className="loading">
              <AiOutlineLoading3Quarters className="loading" />
            </div>
          ) : null}
          <div className="list-image">
            {images.map((image, index) => {
              return (
                <div key={index} className="image">
                  <img src={image} alt={image} onClick={imageClick} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
