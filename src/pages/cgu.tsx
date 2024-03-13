import React from "react";
import "../styles/cgu.css";

const CGU: React.FC = () => {
    return (
        <div className="cgu-container">
            <div className="cgu">
                <h1>Conditions Générales d'Utilisation</h1>
                <p>
                    Bienvenue sur notre site web ou application. Veuillez lire
                    attentivement les conditions générales d'utilisation (CGU) suivantes
                    avant d'utiliser notre site/application.
                </p>
                <h2>1. Acceptation des CGU</h2>
                <p>
                    En utilisant notre site/application, vous acceptez d'être lié par ces
                    CGU. Si vous n'acceptez pas ces CGU, veuillez ne pas utiliser notre
                    site/application.
                </p>
                <h2>2. Propriété intellectuelle</h2>
                <p>
                    Tous les contenus présents sur notre site/application, y compris mais
                    sans s'y limiter, les textes, graphiques, logos, images, vidéos, clips
                    audio, sont la propriété de notre entreprise ou de nos fournisseurs de
                    contenu et sont protégés par les lois sur la propriété intellectuelle.
                </p>
                <h2>3. Création et réponse aux annonces de garde de plantes</h2>
                <p>
                    Notre site/application permet aux utilisateurs de créer des annonces
                    pour demander la garde de leurs plantes. D'autres utilisateurs peuvent
                    répondre à ces annonces et les accepter.
                </p>
                <h2>4. Stockage des données utilisateurs</h2>
                <p>
                    Nous stockons les données suivantes des utilisateurs : email, nom et adresse. Ces informations sont utilisées dans le cadre de notre service et sont traitées conformément à notre politique de confidentialité et selon le RGPD.
                </p>
                <h2>5. Limitation de responsabilité</h2>
                <p>
                    Nous nous efforçons de maintenir notre site/application à jour et
                    accessible, mais nous ne pouvons garantir son fonctionnement continu
                    et sans erreur. Nous déclinons toute responsabilité en cas de dommages
                    directs, indirects, accessoires, consécutifs ou punitifs résultant de
                    l'utilisation de notre site/application.
                </p>
                <h2>6. Modifications des CGU</h2>
                <p>
                    Nous nous réservons le droit de modifier ces CGU à tout moment. Les
                    modifications prendront effet dès leur publication sur notre
                    site/application. Il est de votre responsabilité de consulter
                    régulièrement les CGU pour vous tenir informé des éventuelles
                    modifications.
                </p>
                <h2>7. Contact</h2>
                <p>
                    Si vous avez des questions concernant ces CGU, veuillez nous contacter
                    à l'adresse suivante :{" "}
                    <a href="mailto:contact@arosaje.fr"> contact@arosaje.fr</a>
                </p>
            </div>
        </div>
    );
};

export default CGU;
