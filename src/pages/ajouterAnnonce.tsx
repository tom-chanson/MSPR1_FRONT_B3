// AnnonceForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Plant {
    id: number;
    name: string;
}

const AnnonceForm: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedPlant, setSelectedPlant] = useState<string>('');
    const [plants, setPlants] = useState<Plant[]>([]);

    useEffect(() => {
        // Charger la liste des plantes depuis l'API
        const fetchPlants = async () => {
            try {
                const response = await axios.get('http://localhost:8080/mes_plantes', {
                    headers: {
                        Utilisateur_id: 1,
                    },
                });
                setPlants(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des plantes :', error);
            }
        };

        fetchPlants();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logique pour traiter le formulaire, par exemple, envoyer les données à l'API
        console.log('Titre:', title);
        console.log('Description:', description);
        console.log('Plante sélectionnée:', selectedPlant);
        // Ajoutez la logique pour envoyer les données à l'API ici
    };

    return (
        <div>
            <h1>Formulaire d'Annonce</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Titre:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="plant">Plante:</label>
                    <select
                        id="plant"
                        value={selectedPlant}
                        onChange={(e) => setSelectedPlant(e.target.value)}
                    >
                        <option value="">Sélectionnez une plante</option>
                        {plants.map((plant) => (
                            <option key={plant.id} value={plant.name}>
                                {plant.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Soumettre</button>
            </form>
        </div>
    );
};

export default AnnonceForm;
