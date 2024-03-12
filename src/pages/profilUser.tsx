import React, { useEffect, useRef, useState } from "react";
import "../styles/loginRegister.css";
import { Button, Modal, TextField } from "@mui/material";
import ButtonEditSave from "../components/buttonEditSave";
import InputAdress from "../components/InputAdress";
import {
  Adresse,
  Utilisateur,
  updateEmail,
  updatePassword,
  updateProfil,
} from "../interface";
import InputCreationPassword from "../components/inputCreationPassword";
import { RiErrorWarningFill } from "react-icons/ri";
import { useSnackbar } from "notistack";
import { RequestHelperAuth, useAuth } from "../helpers/request";
import { emailRegex, route_api } from "../constants";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import ModalProfil from "../components/profil/modalProfil";

export default function ProfilUser() {
  const signOut = useSignOut();
  const [email, setEmail] = useState("");
  const [actualPassword, setActualPassword] = useState("");
  const [inputActuelPassword, setInputActuelPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const authHeader = useAuth();

  const [username, setUsername] = useState("");
  const [editProfil, setEditProfil] = useState(false);
  const refProfile = useRef<HTMLFormElement>(null);
  const [loadingProfil, setLoadingProfil] = useState(false);
  const [errorProfil, setErrorProfil] = useState(false);
  const [profilIsSubmit, setProfilIsSubmit] = useState(false);
  const [adresse, setAdresse] = useState<Adresse>({
    latitude: "0",
    longitude: "0",
    adresse: "",
  });

  const sectionProfilClick = (editMod: boolean) => {
    if (editMod) {
      refProfile.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  useEffect(() => {
    if (!authHeader) {
      return;
    }
    RequestHelperAuth<Utilisateur>("GET", route_api.user, authHeader)
      .then((response) => {
        if (response.status === 200) {
          setUsername(response.data.nom);
          setEmail(response.data.mail);
          setAdresse({
            latitude: response.data.adresse.latitude,
            longitude: response.data.adresse.longitude,
            adresse: response.data.adresse.adresse,
          });
        } else {
          console.error(response);
          enqueueSnackbar("Erreur lors de la récupération du profil", {
            variant: "error",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar("Erreur lors de la récupération du profil", {
          variant: "error",
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeader]);

  const handleSubmitProfil = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfilIsSubmit(true);
    if (!errorProfil) {
      //envoyer les données
      const data: updateProfil = {
        nom: username,
        adresse: adresse,
      };
      if (authHeader) {
        setLoadingProfil(true);
        RequestHelperAuth("PUT", route_api.user, authHeader, data)
          .then((response) => {
            if (response.status === 200) {
              enqueueSnackbar("Profil mis à jour", { variant: "success" });
              setEditProfil(false);
              setLoadingProfil(false);
              setProfilIsSubmit(false);
            } else {
              console.error(response);
              setLoadingProfil(false);
              enqueueSnackbar("Erreur lors de la mise à jour du profil", {
                variant: "error",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            setLoadingProfil(false);
            enqueueSnackbar("Erreur lors de la mise à jour du profil", {
              variant: "error",
            });
          });
      }
    }
  };

  useEffect(() => {
    setErrorProfil(
      !username ||
        adresse.adresse === "" ||
        adresse.latitude === "0" ||
        adresse.longitude === "0"
    );
  }, [username, adresse]);

  const [editEmail, setEditEmail] = useState(false);
  const refEmail = useRef<HTMLFormElement>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [emailIsSubmit, setEmailIsSubmit] = useState(false);

  const sectionEmailClick = (editMod: boolean) => {
    if (editMod) {
      setEmailIsSubmit(true);
      if (!errorEmail) {
        setFormTarget(refEmail);
        setModalOpenCurrentPassword(true);
      }
    }
  };

  const handleSubmitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailIsSubmit(true);
    if (!errorEmail) {
      //envoyer les données
      const data: updateEmail = {
        newMail: email,
        mdp: actualPassword,
      };
      if (authHeader) {
        setLoadingEmail(true);
        RequestHelperAuth("PUT", route_api.put_mail, authHeader, data)
          .then((response) => {
            if (response.status === 200) {
              enqueueSnackbar("Email mis à jour", { variant: "success" });
              setEditEmail(false);
              setLoadingEmail(false);
              setEmailIsSubmit(false);
            } else {
              console.error(response);
              setLoadingEmail(false);
              enqueueSnackbar("Erreur lors de la mise à jour de l'email", {
                variant: "error",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            setLoadingEmail(false);
            enqueueSnackbar("Erreur lors de la mise à jour de l'email", {
              variant: "error",
            });
          });
      }
    }
  };

  useEffect(() => {
    setErrorEmail(!email || !emailRegex.test(email));
  }, [email]);

  const [editPassword, setEditPassword] = useState(false);
  const refPassword = useRef<HTMLFormElement>(null);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordOnError, setPasswordOnError] = useState(false);
  const [errorPassword, setErrorPassword] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    confirmPassword: false,
    showError: false,
    showConfirmError: false,
  });

  useEffect(() => {
    setPasswordOnError(
      !errorPassword.length ||
        !errorPassword.uppercase ||
        !errorPassword.lowercase ||
        !errorPassword.number ||
        !errorPassword.special ||
        !errorPassword.confirmPassword ||
        password !== confirmPassword
    );
  }, [errorPassword, password, confirmPassword]);

  const sectionPasswordClick = (editMod: boolean) => {
    if (editMod && !passwordOnError) {
      setFormTarget(refPassword);
      setModalOpenCurrentPassword(true);
    }
  };

  const handleSubmitPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordOnError) {
      if (authHeader) {
        const data: updatePassword = {
          newMdp: password,
          mdp: actualPassword,
        };
        setLoadingPassword(true);
        RequestHelperAuth("PUT", route_api.put_password, authHeader, data)
          .then((response) => {
            if (response.status === 200) {
              enqueueSnackbar("Mot de passe mis à jour", {
                variant: "success",
              });
              setEditPassword(false);
              setLoadingPassword(false);
            } else {
              console.error(response);
              setLoadingPassword(false);
              enqueueSnackbar("Erreur lors de la mise à jour du mot de passe", {
                variant: "error",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            setLoadingPassword(false);
            enqueueSnackbar("Erreur lors de la mise à jour du mot de passe", {
              variant: "error",
            });
          });
      }
    }
  };

  const [modalOpenCurrentPasswor, setModalOpenCurrentPassword] =
    useState(false);
  const [modalOpenDataRecovery, setModalOpenDataRecovery] =
      useState(false);

  //sélection du ref target
  const [formTarget, setFormTarget] =
    useState<React.RefObject<HTMLFormElement> | null>(null);

  const handleModalValid = () => {
    if (formTarget) {
      console.log(formTarget);
      formTarget.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
    setInputActuelPassword("");
    setModalOpenCurrentPassword(false);
  };
  const navigate = useNavigate();

  const handleSubmitDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //requete delete
    if (authHeader) {
      RequestHelperAuth<boolean>("DELETE", route_api.user, authHeader, {
        mdp: actualPassword,
      })
        .then((response) => {
          //renvoie true si succes, sinon false
          if (response.status === 200 && response.data === true) {
            enqueueSnackbar(
              "Compte supprimé, redirection vers la page d'accueil dans 5 secondes",
              { variant: "success" }
            );
            signOut();
            setTimeout(() => {
              navigate("/");
            }, 5000);
          } else {
            console.error(response);
            if (response.data === false) {
              enqueueSnackbar("Mot de passe incorrect", {
                variant: "error",
              });
            } else {
              enqueueSnackbar("Erreur lors de la suppression du compte", {
                variant: "error",
              });
            }
          }
        })
        .catch((error) => {
          console.error(error);
          enqueueSnackbar("Erreur lors de la suppression du compte", {
            variant: "error",
          });
        });
    }
  };

  const handleClickDelete = () => {
    setFormTarget(refDelete);
    setModalOpenCurrentPassword(true);
  };
  const refDelete = useRef<HTMLFormElement>(null);

  return (
    <div className="container-auth">
      <div className="container-login-register">
        <div className="auth-form">
          <h1 className="title">Profil utilisateur</h1>
          <div>
            <form
              className="section section-profil"
              onSubmit={handleSubmitProfil}
              ref={refProfile}
            >
              <ButtonEditSave
                editMode={editProfil}
                setEditMode={setEditProfil}
                onClick={sectionProfilClick}
                error={errorProfil}
                loading={loadingProfil}
              />
              <div className="input-container">
                <TextField
                  label="Nom d'utilisateur"
                  variant="outlined"
                  value={username}
                  disabled={!editProfil}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-w100"
                  required
                />
                {!username && profilIsSubmit && (
                  <div className="container-error">
                    <span className="error">
                      <RiErrorWarningFill /> Le nom d'utilisateur est requis
                    </span>
                  </div>
                )}
                <span>{profilIsSubmit}</span>
              </div>
              <div className="input-container">
                <InputAdress
                  setAdresse={setAdresse}
                  disabled={!editProfil}
                  adresse={adresse}
                />
                {(adresse.adresse === "" ||
                  adresse.latitude === "0" ||
                  adresse.longitude === "0") &&
                  profilIsSubmit && (
                    <div className="container-error">
                      <span className="error">
                        <RiErrorWarningFill /> Une adresse valide est requise
                      </span>
                    </div>
                  )}
              </div>
            </form>
            <form
              className="section section-email"
              ref={refEmail}
              onSubmit={handleSubmitEmail}
            >
              <ButtonEditSave
                editMode={editEmail}
                setEditMode={setEditEmail}
                onClick={sectionEmailClick}
                error={errorEmail}
                loading={loadingEmail}
              />
              <div className="input-container">
                <TextField
                  label="Email"
                  variant="outlined"
                  value={email}
                  disabled={!editEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-w100"
                  required
                />
                <div className="container-error">
                  {!email && emailIsSubmit && (
                    <span className="error">
                      <RiErrorWarningFill /> L'email est requis
                    </span>
                  )}
                  {emailIsSubmit && !emailRegex.test(email) && (
                    <span className="error">
                      <RiErrorWarningFill /> L'email n'est pas valide
                    </span>
                  )}
                </div>
              </div>
            </form>
            <form
              className="section section-password"
              onSubmit={handleSubmitPassword}
              ref={refPassword}
            >
              <ButtonEditSave
                editMode={editPassword}
                setEditMode={setEditPassword}
                onClick={sectionPasswordClick}
                error={passwordOnError}
                loading={loadingPassword}
              />
              <div className="input-container">
                <InputCreationPassword
                  setPassword={setPassword}
                  setConfirmPassword={setConfirmPassword}
                  setErrorPassword={setErrorPassword}
                  errorPassword={errorPassword}
                  label="Nouveau mot de passe"
                  disabled={!editPassword}
                />
              </div>
            </form>
            <div  className="input-container">
                <Button
                    variant="contained"
                    color="warning"
                    onClick={() => setModalOpenDataRecovery(true)}
                >
                    Récupérer mes données
                </Button>
            </div>


            <form
              className="section section-delete"
              ref={refDelete}
              onSubmit={handleSubmitDelete}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleClickDelete}
              >
                Supprimer mon compte (action irréversible)
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Modal
        open={modalOpenCurrentPasswor}
        onClose={() => setModalOpenCurrentPassword(false)}
        className="modal modal-form"
      >
        <div className="modal-content">
          <h2>Mot de passe actuel requis</h2>
          <div className="modal-form-input">
            <TextField
              label="Mot de passe actuel"
              variant="outlined"
              type="password"
              value={inputActuelPassword}
              onChange={(e) => {
                setActualPassword(e.target.value);
                setInputActuelPassword(e.target.value);
              }}
              className="input-w100"
              required
            />
          </div>
          <div className="modal-form-button">
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalValid}
            >
              Valider
            </Button>
          </div>
        </div>
      </Modal>
        <ModalProfil
            modalOpen={modalOpenDataRecovery}
            setModalOpen={setModalOpenDataRecovery}
        />
    </div>
  );
}
