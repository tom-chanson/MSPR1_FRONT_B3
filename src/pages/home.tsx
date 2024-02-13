import React, { useState} from 'react';
import "leaflet/dist/leaflet.css";
import '../styles/home.css';
import {MapContainer, TileLayer} from 'react-leaflet';

import Button from "../components/bouton";


const MapComponent: React.FC = () => {
    const initialCenter: [number, number] = [47.209499162, -1.5499978];
    const zoom: number = 13;

    const [center, setCenter] = useState<[number, number]>(initialCenter);
    const [key, setKey] = useState<number>(0);

    const updateUserPosition = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const userPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
            setCenter(userPosition);
            setKey((prevKey) => prevKey + 1);
        });
    };

    return (
        <div>
            <div className="containerMap">
                <MapContainer key={key} center={center} zoom={zoom} className="map-container">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
            <div className="containerButton">
                <Button
                    label="Plantes chaude dans ma région"
                    color="#456654"
                    textSize="20px"
                    onClick={updateUserPosition}
                />
            </div>
        </div>
    );
};

export default MapComponent;