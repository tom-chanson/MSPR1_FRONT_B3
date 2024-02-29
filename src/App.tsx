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

const store = createStore<IUserData>({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

function App() {
  return (
    <AuthProvider store={store}>
      <BrowserRouter>
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
                path="/some"
                element={<h1>Route qui nécessite d'être authentifié</h1>}
                id="some"
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
