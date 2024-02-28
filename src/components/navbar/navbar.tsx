import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import { GiPlantWatering } from "react-icons/gi";
import { FaBars, FaTimes } from "react-icons/fa";
import { CgProfile, CgLogIn, CgLogOut } from "react-icons/cg";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";

function Navbar() {
  const [click, setClick] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const signOut = useSignOut();
  const handleSignOut = () => {
    signOut();
    closeMobileMenu();
    window.location.reload();
  };
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <GiPlantWatering className="navbar-icon" />
            Arosa'je
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            {click ? <FaTimes /> : <FaBars />}
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link
                to="/mesannonces"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Mes annonces
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/article"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Articles
              </Link>
            </li>
            <li>
              {isAuthenticated() ? (
                <Link
                  to="/profil"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  <CgProfile />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  <CgLogIn />
                </Link>
              )}
            </li>
            <li>
              {isAuthenticated() ? (
                <div
                  onClick={handleSignOut}
                  className="nav-links"
                  style={{ cursor: "pointer" }}
                >
                  <CgLogOut />
                </div>
              ) : null}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
