import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";

import { IUserData } from "./interface";

import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Navbar from "./components/navbar/navbar";
import EditArticle from "./pages/editArticle";
import ViewArticle from "./pages/viewArticle";
import ListArticle from "./pages/listArticle";
import AnnonceForm from "./pages/ajouterAnnonce";
import PlantForm from "./pages/ajouterPlante";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { MdClose } from "react-icons/md";
import { Profil } from "./pages/profil";
import UserProfile from "./pages/profilUser";
import CGU from "./pages/cgu";

const store = createStore<IUserData>({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

function App() {
  return (
    <AuthProvider store={store}>
      <BrowserRouter basename="/MSPR1_FRONT_B3">
        <Navbar />
        <SnackbarProvider
          preventDuplicate
          maxSnack={3}
          dense
          action={(snackbarId) => (
            <MdClose
              onClick={() => {
                closeSnackbar(snackbarId);
              }}
              style={{ cursor: "pointer" }}
            />
          )}
        >
          <Routes>
            <Route path="/" element={<Home />} id="home" />
            <Route path="/cgu" element={<CGU />} id="cgu" />
            <Route path="/login" element={<Login />} id="login" />
            <Route path="/register" element={<Register />} id="register" />
            <Route
              path="/article"
              element={<ListArticle />}
              id="list-article"
            />
            <Route
              path="/article/:id"
              element={<ViewArticle />}
              id="article-id"
            />
            <Route element={<AuthOutlet fallbackPath="/login" />}>
              <Route
                path="/edit-article"
                element={<EditArticle />}
                id="edit-article"
              />
              <Route
                path="/edit-article/:id"
                element={<EditArticle />}
                id="edit-article-id"
              />
              <Route
                path="/add-annonce"
                element={<AnnonceForm />}
                id="add-annonce"
              />
              <Route
                path="/add-plante"
                element={<PlantForm />}
                id="add-plante"
              />
              <Route
                path="/user-profil"
                element={<UserProfile />}
                id="user-profil"
              />
              <Route path="/profil" element={<Profil />} id="profil" />
            </Route>
          </Routes>
        </SnackbarProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
