import React, { useEffect, useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import {
  IUserData,
  Adresse,
  UtilisateurInscription,
  UtilisateurConnexion,
  PasswordError,
} from "../interface";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { RequestHelper } from "../helpers/request";
import "../styles/loginRegister.css";
import { emailRegex, route_api } from "../constants";
import InputAdress from "../components/InputAdress";
import { TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import InputCreationPassword from "../components/inputCreationPassword";

function Register() {
  const [email, setEmail] = useState("");
  const [adresse, setAdresse] = useState<Adresse>({
    latitude: "0",
    longitude: "0",
    adresse: "",
  });
  const [errorEmail, setErrorEmail] = useState({
    emailValid: false,
    showError: false,
    emailExist: false,
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState<PasswordError>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    confirmPassword: false,
    showError: false,
    showConfirmError: false,
  });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = useSignIn<IUserData>();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorEmail({
      ...errorEmail,
      showError: true,
    });
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    if (
      !errorEmail.emailExist &&
      errorEmail.emailValid &&
      password.length > 0 &&
      username.length > 0 &&
      confirmPassword.length > 0 &&
      password === confirmPassword &&
      !loading &&
      adresse.latitude !== "0" &&
      adresse.longitude !== "0"
    ) {
      setDisabled(false);
      console.log("disabled false");
    } else {
      setDisabled(true);
      console.log("disabled true");
    }
  }, [
    email,
    password,
    username,
    confirmPassword,
    loading,
    errorEmail,
    adresse.latitude,
    adresse.longitude,
  ]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setErrorEmail({
      ...errorEmail,
      emailValid: emailRegex.test(email),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!disabled) {
      setLoading(true);
      const formData: UtilisateurInscription = {
        mail: email,
        nom: username,
        mdp: password,
        botaniste: false,
        adresse: adresse,
      };
      try {
        const response = await RequestHelper<UtilisateurConnexion>(
          "POST",
          route_api.register,
          formData
        );
        if (response.status === 200) {
          enqueueSnackbar("Inscription réussie", {
            variant: "success",
          });
          if (
            signIn({
              auth: {
                token: response.data.token,
              },
            })
          )
            navigate("/");
        } else {
          console.error(response);
          enqueueSnackbar("Erreur lors de l'inscription", { variant: "error" });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Erreur lors de l'inscription", { variant: "error" });
      }
    }
    setLoading(false);
  };

  return (
    <div className="container-auth">
      <div className="container-login-register">
        <div className="auth-form">
          <h1 className="title">S'inscrire</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <TextField
                type="email"
                value={email}
                onInput={handleEmailChange}
                autoComplete="email"
                label="Email"
                className="input-w100"
                required
              />
            </div>
            {errorEmail.showError ? (
              <div className="container-error">
                {!errorEmail.emailValid ? (
                  <span className="error">
                    <RiErrorWarningFill /> Email invalide
                  </span>
                ) : null}
                {errorEmail.emailExist ? (
                  <span className="error">
                    <RiErrorWarningFill /> Email déjà utilisé
                  </span>
                ) : null}
              </div>
            ) : null}
            <div className="input-container">
              <TextField
                type="text"
                value={username}
                onInput={handleUsernameChange}
                autoComplete="username"
                label="Nom"
                className="input-w100"
                required
              />
            </div>
            <div className="input-container">
              <InputAdress setAdresse={setAdresse} />
            </div>
            <InputCreationPassword
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              setErrorPassword={setErrorPassword}
              errorPassword={errorPassword}
            />
            <div className="input-container">
              <input type="checkbox" required />
                <span className="checkbox-text">En soumettant ce formulaire, j'accepte les conditions générales d'utilisations du site Arosa-je
                </span>
            </div>
            <button
                type="submit"
                className="btn-auth-form btn-auth-form-submit"
              disabled={disabled}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="loading" />
              ) : null}{" "}
              S'inscrire
            </button>
          </form>
          <div className="signup">
            <span className="signup">Déja un compte ? </span>
            <Link to="/login">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
