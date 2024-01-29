import './styles/App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';

import { IUserData } from './interface';

import Login from './pages/login';
import Register from './pages/register';
import Home from "./pages/home";

const store = createStore<IUserData>({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

function App() {
  return (
    <AuthProvider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} id='home'/>
          <Route path="/login" element={<Login />} id='login'/>
          <Route path="/register" element={<Register/>} id='register'/>
          <Route element={<AuthOutlet fallbackPath='/login' />}>
            <Route path="/some" element={<h1>Route qui nécessite d'être authentifié</h1>} id='some'/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
