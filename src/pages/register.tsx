import React, { useEffect, useState } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { IAuthResponse, IUserData } from '../interface';
import { Link } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { RequestHelper } from '../helpers/request';



function Register () {
    const [email, setEmail] = useState('');
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
        if (errorEmail.emailExist && errorEmail.emailValid && password.length > 0 && username.length > 0 && confirmPassword.length > 0 && password === confirmPassword && !loading) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }    }, [email, password, username, confirmPassword, loading, errorEmail])

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
        if (!disabled) {
            e.preventDefault();
            setLoading(true);
            const formData = {
                email: email,
                name: username,
                password: password,
            };
            try {
                const response = await RequestHelper<IAuthResponse>('POST', '/register', formData);
                if (response.status === 200) {
                    if (signIn({
                        auth: {
                            token: response.data.token
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
        <div className="container">
            <div className="auth-form">
                <h1 className='title'>Se connecter</h1>
                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='Email' value={email} onInput={handleEmailChange} autoComplete='email'/>
                    {errorEmail.showError ?
                    <div className="container-error">
                        {!errorEmail.emailValid ? <span className='error'><RiErrorWarningFill/> Email invalide</span> : null}
                        {errorEmail.emailExist ? <span className='error'><RiErrorWarningFill/> Email déjà utilisé</span> : null}
                    </div>
                    : null}
                    <input type='text' placeholder="Nom" value={username} onInput={handleUsernameChange} autoComplete='username'/>
                    <input type='password' placeholder='Mot de passe' value={password} onInput={handlePasswordChange} autoComplete='current-password'/>
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
                    <input type='password' placeholder='Confirmer le mot de passe' value={confirmPassword} onInput={handleConfirmPasswordChange}  autoComplete='current-password'/>
                    : null}

                    {errorPassword.showConfirmError && errorPassword.length && errorPassword.uppercase && errorPassword.lowercase && errorPassword.number && errorPassword.special ?
                    <div className="container-error">
                        {!errorPassword.confirmPassword ? <span className='error'><RiErrorWarningFill/> Les mots de passe ne correspondent pas</span> : null}
                    </div>
                    : null}
                    <button  type='submit' className='btn-auth-form' disabled={disabled}>{loading ? <AiOutlineLoading3Quarters className='loading'/> : null} S'inscrire</button>
                </form>
                <div className="signup">
                    <span className='signup'>Pas encore de compte ? </span><Link to='/signup' >S'inscrire</Link>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Register;
