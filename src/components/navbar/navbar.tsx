import React, {useState} from "react";
import {Link} from "react-router-dom";
import "../../styles/navbar.css";
import {GiPlantWatering} from "react-icons/gi";
import {FaBars, FaTimes} from "react-icons/fa";
import {CgProfile} from "react-icons/cg";

function Navbar() {
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container container">
                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        <GiPlantWatering className="navbar-icon"/>
                        Arosa'je
                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        {click ? <FaTimes/> : <FaBars/>}
                    </div>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <Link to="/mesannonces" className="nav-links" onClick={closeMobileMenu}>
                                Mes annonces
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/forum" className="nav-links" onClick={closeMobileMenu}>
                                Forum
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/article" className="nav-links" onClick={closeMobileMenu}>
                                Articles
                            </Link>
                        </li>
                        <li>
                            <Link to="/profil" className="nav-links" onClick={closeMobileMenu}>
                                <CgProfile/>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Navbar;