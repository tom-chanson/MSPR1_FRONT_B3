import React, { useState } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { UtilisateurConnexion, IUserData } from '../interface';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RequestHelper } from '../helpers/request';
import "../styles/loginRegister.css"
import { route_api } from '../constants';



function Login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signIn = useSignIn<IUserData>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                email: email,
                password: password,
            };
            try {
                // const response = await RequestHelper<UtilisateurConnexion>('POST', route_api.login, formData);
                const response = await RequestHelper<any>('POST', route_api.login, formData);
                if (response.status === 200) {
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
                            // token: response.data.token
                            token: fakeToken
                        },
                        userState: {
                            id: response.data.id,
                            nom: response.data.name
                        }
                    }))
                    navigate('/some'); //TODO: modifier la redirection
                } else {
                    alert('Erreur lors de la connexion'); //TODO: modifier l'alerte
                    console.error(response);
                }
            } catch (error) {
                alert('Erreur lors de la connexion'); //TODO: modifier l'alerte
                console.error(error);
            }
            setLoading(false);
        }
    }

    return (
<div className='container-auth'>
        <div className="container-login-register">
            <div className="auth-form">
                <h1 className='title'>Se connecter</h1>
                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='Email' value={email} onChange={handleEmailChange} autoComplete='email' name='email'/>
                    <input type='password' placeholder='Mot de passe' value={password} onChange={handlePasswordChange} autoComplete='current-password' name='password'/>
                    <button  type='submit' className='btn-auth-form btn-auth-form-submit' disabled={loading}>{loading ? <AiOutlineLoading3Quarters className='loading'/> : null} Se connecter</button>
                </form>
                <div className="signup">
                    <span className='signup'>Pas encore de compte ? </span><Link to='/register' >S'inscrire</Link>
                </div>
            </div>

        </div>
        </div>
    );
};

export default Login;
