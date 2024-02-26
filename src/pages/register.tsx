import React, { useEffect, useState } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { IUserData, Adresse, UtilisateurInscription } from '../interface';
import { Link } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { RequestHelper } from '../helpers/request';
import "../styles/loginRegister.css"
import { route_api } from '../constants';
import InputAdress from '../components/InputAdress';
import { TextField } from '@mui/material';



function Register () {
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState<Adresse>({
        latitude: "0",
        longitude: "0",
        adresse: ''
    });
    const [errorEmail, setErrorEmail] = useState(
        {emailValid: false, showError: false, emailExist: false}
    );
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        confirmPassword: false,
        showError: false,
        showConfirmError: false
    });
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const signIn = useSignIn<IUserData>();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrorEmail({
            ...errorEmail,
            showError: true
        });
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setErrorPassword({
            ...errorPassword,
            showError: true
        });
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setErrorPassword({
            ...errorPassword,
            showConfirmError: true
        });
    }

    useEffect(() => {
        if (!errorEmail.emailExist && errorEmail.emailValid && password.length > 0 && username.length > 0 && confirmPassword.length > 0 && password === confirmPassword && !loading && adresse.latitude !== "0" && adresse.longitude !== "0") {
            setDisabled(false);
        } else {
            setDisabled(true);
        }    }, [email, password, username, confirmPassword, loading, errorEmail, adresse.latitude, adresse.longitude])

    useEffect(() => {
        setErrorPassword({
            ...errorPassword,
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password),
            confirmPassword: password === confirmPassword,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password, confirmPassword])

    useEffect(() => {
        // Check if email is valid (first part: before @, second part: after @) => first part can contain letters, numbers and + (one or zero, not more), contains letters again, second part can contain letters, numbers, . and 2 to 4 letters
        const emailRegex = /^[a-zA-Z0-9]+[+]?[a-zA-Z0-9]@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
        setErrorEmail({
            ...errorEmail,
            emailValid: emailRegex.test(email)
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!disabled) {
            setLoading(true);
            const formData: UtilisateurInscription = {
                mail: email,
                nom: username,
                mdp: password,
                botaniste: false,
                adresse: adresse
            };
            try {
                // const response = await RequestHelper<UtilisateurConnexion>('POST', route_api.register, formData);
                const response = await RequestHelper<any>('POST', route_api.register, formData);
                if (response.status === 200) {
                    console.log(response);

                    // Création d'un faux jeton pour test. Le jeton doit être au format jwt
                    const now = Math.floor(Date.now() / 1000);
                    const oneDayFromNow = now + 60 * 60 * 24;
                    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
                    const payload = btoa(JSON.stringify({ id: response.data.id, name: response.data.name, mail: response.data.mail, exp: oneDayFromNow }));
                    const signature = 'fake-signature';
                    const fakeToken = `${header}.${payload}.${signature}`;
                    if (signIn({
                        auth: {
                            /* faux jeton pour test. Le jeton doit être au format jwt */
                            token: fakeToken
                        },
                        userState: {
                            id: response.data.id,
                            nom: response.data.name
                        }
                    }))
                    navigate('/some'); //TODO: modifier la redirection
                } else {
                    alert('Erreur lors de l\'inscription'); //TODO: modifier l'alerte
                    console.error(response);
                }
            } catch (error) {
                alert('Erreur lors de l\'inscription'); //TODO: modifier l'alerte
                console.error(error);
            }
        }
        setLoading(false);
    }

    return (
<div className='container-auth'>
        <div className="container-login-register">
            <div className="auth-form">
                <h1 className='title'>S'inscrire</h1>
                <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <TextField type='email' value={email} onInput={handleEmailChange} autoComplete='email' label='Email' className='input-w100' required/>
                </div>
                    {errorEmail.showError ?
                    <div className="container-error">
                        {!errorEmail.emailValid ? <span className='error'><RiErrorWarningFill/> Email invalide</span> : null}
                        {errorEmail.emailExist ? <span className='error'><RiErrorWarningFill/> Email déjà utilisé</span> : null}
                    </div>
                    : null}
                    <div className="input-container">
                    <TextField type='text' value={username} onInput={handleUsernameChange} autoComplete='username' label='Nom'  className='input-w100' required/>
                    </div>
                    <div className="input-container">
                    <InputAdress setAdresse={setAdresse} />
                    </div>
                    <div className="input-container">
                    <TextField type='password' label='Mot de passe' value={password} onInput={handlePasswordChange}  autoComplete='current-password' className='input-w100' required/>
                    </div>
                    {errorPassword.showError ?
                    <div className="container-error">
                        {!errorPassword.length ? <span className='error'><RiErrorWarningFill/> Le mot de passe doit contenir au moins 8 caractères</span> : null}
                        {!errorPassword.uppercase ? <span className='error'><RiErrorWarningFill/> Le mot de passe doit contenir au moins une majuscule</span> : null}
                        {!errorPassword.lowercase ? <span className='error'><RiErrorWarningFill/> Le mot de passe doit contenir au moins une minuscule</span> : null}
                        {!errorPassword.number ? <span className='error'><RiErrorWarningFill/> Le mot de passe doit contenir au moins un chiffre</span> : null}
                        {!errorPassword.special ? <span className='error'><RiErrorWarningFill/> Le mot de passe doit contenir au moins un caractère spécial</span> : null}
                    </div>
                    : null}

                    {errorPassword.length && errorPassword.uppercase && errorPassword.lowercase && errorPassword.number && errorPassword.special ? 
                    <TextField type='password' label='Confirmer le mot de passe' value={confirmPassword} onInput={handleConfirmPasswordChange}  autoComplete='current-password'  className='input-w100' required/>
                    : null}

                    {errorPassword.showConfirmError && errorPassword.length && errorPassword.uppercase && errorPassword.lowercase && errorPassword.number && errorPassword.special ?
                    <div className="container-error">
                        {!errorPassword.confirmPassword ? <span className='error'><RiErrorWarningFill/> Les mots de passe ne correspondent pas</span> : null}
                    </div>
                    : null}
                    <button type='submit' className='btn-auth-form btn-auth-form-submit' disabled={disabled}>{loading ? <AiOutlineLoading3Quarters className='loading'/> : null} S'inscrire</button>
                </form>
                <div className="signup">
                    <span className='signup'>Déja un compte ? </span><Link to='/login' >Se connecter</Link>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Register;

