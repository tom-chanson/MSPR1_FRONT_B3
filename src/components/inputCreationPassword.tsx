import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { RiErrorWarningFill } from "react-icons/ri";
import { PasswordError } from "../interface";

export default function InputCreationPassword(props: {
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  errorPassword: PasswordError;
  setErrorPassword: React.Dispatch<React.SetStateAction<PasswordError>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
  disabled?: boolean;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    props.setErrorPassword({
      ...props.errorPassword,
      showError: true,
    });
  };

  useEffect(() => {
    props.setPassword(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => {
    props.setConfirmPassword(confirmPassword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPassword]);

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    props.setErrorPassword({
      ...props.errorPassword,
      showConfirmError: true,
    });
  };

  useEffect(() => {
    props.setErrorPassword({
      ...props.errorPassword,
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password),
      confirmPassword: password === confirmPassword,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmPassword]);

  return (
    <>
      <div className="input-container">
        <TextField
          type="password"
          label={props.label ? props.label : "Mot de passe"}
          value={password}
          onInput={handlePasswordChange}
          autoComplete="current-password"
          className="input-w100"
          required
          disabled={props.disabled}
        />
      </div>
      {props.errorPassword.showError ? (
        <div className="container-error">
          {!props.errorPassword.length ? (
            <span className="error">
              <RiErrorWarningFill /> Le mot de passe doit contenir au moins 8
              caractères
            </span>
          ) : null}
          {!props.errorPassword.uppercase ? (
            <span className="error">
              <RiErrorWarningFill /> Le mot de passe doit contenir au moins une
              majuscule
            </span>
          ) : null}
          {!props.errorPassword.lowercase ? (
            <span className="error">
              <RiErrorWarningFill /> Le mot de passe doit contenir au moins une
              minuscule
            </span>
          ) : null}
          {!props.errorPassword.number ? (
            <span className="error">
              <RiErrorWarningFill /> Le mot de passe doit contenir au moins un
              chiffre
            </span>
          ) : null}
          {!props.errorPassword.special ? (
            <span className="error">
              <RiErrorWarningFill /> Le mot de passe doit contenir au moins un
              caractère spécial
            </span>
          ) : null}
        </div>
      ) : null}

      {props.errorPassword.length &&
      props.errorPassword.uppercase &&
      props.errorPassword.lowercase &&
      props.errorPassword.number &&
      props.errorPassword.special ? (
        <TextField
          type="password"
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onInput={handleConfirmPasswordChange}
          autoComplete="current-password"
          className="input-w100"
          required
        />
      ) : null}

      {props.errorPassword.showConfirmError &&
      props.errorPassword.length &&
      props.errorPassword.uppercase &&
      props.errorPassword.lowercase &&
      props.errorPassword.number &&
      props.errorPassword.special ? (
        <div className="container-error">
          {!props.errorPassword.confirmPassword ? (
            <span className="error">
              <RiErrorWarningFill /> Les mots de passe ne correspondent pas
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
