import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ajouterAnnonce.css";
import { RequestHelperAuth, useAuth } from "../helpers/request";
import { Plante } from "../interface";
import { route_api } from "../constants";
import { useSnackbar } from "notistack";
import { format } from "date-fns";


const AnnonceForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [plants, setPlants] = useState<Plante[]>([]);
  const authHeader = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        if (!authHeader) {
          return;
        }
        RequestHelperAuth<Plante[]>(
          "GET",
          route_api.get_plante,
          authHeader
        ).then((response) => {
          setPlants(response.data);
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des plantes :", error);
        enqueueSnackbar("Erreur lors de la récupération des plantes", {
          variant: "error",
        });
      }
    };

    fetchPlants();
  }, [authHeader, enqueueSnackbar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const plantId = plants.find((plant) => plant.espece === selectedPlant)?.id;

    if (!plantId) {
      console.error("ID de plante non trouvé pour la plante sélectionnée.");
      enqueueSnackbar("Erreur lors de la récupération de l'ID de la plante", {
        variant: "error",
      });
      return;
    }

    const formData = {
      titre: title,
      description: description,
      etat: "en_attente",
      date_debut: format(new Date(startDate), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      date_fin: format(new Date(endDate), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      besoin_aide: false,
      plante: {
        id: plants.find((plant) => plant.espece === selectedPlant)?.id,
      },
      utilisateur: {
        id: authHeader,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/annonce/once",
        formData
      );
      console.log("Réponse de l'API:", response.data);
      enqueueSnackbar("Annonce ajoutée avec succès", { variant: "success" });
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des données du formulaire :",
        error
      );
      enqueueSnackbar("Erreur lors de l'envoi des données du formulaire", {
        variant: "error",
      });
    }
  };

  return (
    <div className="container-form">
      <div className="form-container">
        <h1 className="form-title">Ajouter une annonce</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Titre:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="plant">Plante:</label>
            <select
              id="plant"
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="form-select"
            >
              <option value="">Sélectionnez une plante</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.espece}>
                  {plant.espece}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="startDate">Date de début:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="endDate">Date de fin:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="form-submit">
            Poster l'annonce
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnnonceForm;
