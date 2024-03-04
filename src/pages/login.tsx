import React, { useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { IUserData, UtilisateurConnexion } from "../interface";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RequestHelper } from "../helpers/request";
import "../styles/loginRegister.css";
import { route_api } from "../constants";
import { TextField } from "@mui/material";
import { useSnackbar } from "notistack";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useSignIn<IUserData>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!loading) {
      e.preventDefault();
      setLoading(true);
      const formData = {
        mail: email,
        mdp: password,
      };
      try {
        const response = await RequestHelper<UtilisateurConnexion>(
          "POST",
          route_api.login,
          formData
        );
        if (response.status === 200) {
          if (
            signIn({
              auth: {
                token: response.data.token,
              },
            })
          )
            navigate("/"); //TODO: modifier la redirection
        } else {
          enqueueSnackbar("Erreur lors de la connexion", { variant: "error" });
          setPassword("");
        }
      } catch (error) {
        enqueueSnackbar("Erreur lors de la connexion", { variant: "error" });
        setPassword("");
      }
      setLoading(false);
    }
  };

  return (
    <div className="container-auth">
      <div className="container-login-register">
        <div className="auth-form">
          <h1 className="title">Se connecter</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <TextField
                type="email"
                label="Email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                name="email"
                className="input-w100"
                required
              />
            </div>
            <div className="input-container">
              <TextField
                type="password"
                label="Mot de passe"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                name="password"
                className="input-w100"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-auth-form btn-auth-form-submit"
              disabled={loading || !password || !email}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="loading" />
              ) : null}{" "}
              Se connecter
            </button>
          </form>
          <div className="signup">
            <span className="signup">Pas encore de compte ? </span>
            <Link to="/register">S'inscrire</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
