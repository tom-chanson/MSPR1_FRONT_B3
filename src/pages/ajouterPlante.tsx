import React, { useState} from 'react';
import '../styles/ajouterPlante.css';

const PlantForm: React.FC = () => {
    const [espece, setEspece] = useState<string>('');
    const [image, setImage] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Espèce:', espece);
        console.log('Image:', image);
    };

    return (
        <div className='container-form'>
            <div className="form-container">
                <h1 className='form-title'>Ajouter une plante</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="espece">Espèce:</label>
                        <input
                            type="text"
                            id="espece"
                            value={espece}
                            onChange={(e) => setEspece(e.target.value)}
                            className='form-input'
                        />
                    </div>
                    <div>
                        <label htmlFor="image">Image:</label>
                        <input
                            type="text"
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className='form-input'
                        />
                    </div>
                    <button type='submit' className='form-submit'>Ajouter</button>
                </form>
            </div>
        </div>
    );
}

export default PlantForm;