import Button from "../components/bouton";
import { useNavigate } from "react-router-dom";
import "../styles/profil.css";

export function Profil() {
  const navigate = useNavigate();
  return (
    <div className="container-button">
      <ul>
        <li>
          <Button
            label="Ajouter une annonce"
            color="#456654"
            textSize="20px"
            onClick={() => navigate("/add-annonce")}
          />
        </li>
        <li>
          <Button
            label="Ajouter une plante"
            color="#456654"
            textSize="20px"
            onClick={() => navigate("/add-plante")}
          />
        </li>
        <li>
          <Button
            label="Profil"
            color="#456654"
            textSize="20px"
            onClick={() => navigate("/user-profil")}
          />
        </li>
      </ul>
    </div>
  );
}
