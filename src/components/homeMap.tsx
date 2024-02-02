import React, { useState} from 'react';
import "leaflet/dist/leaflet.css";
import '../styles/home.css';
import {MapContainer, TileLayer} from 'react-leaflet';

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
        <div className="containerMap">
            <MapContainer key={key} center={center} zoom={zoom} className="map-container" style={{height:'400px', width:'100%'}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
            <button onClick={updateUserPosition}>Chercher dans ma zone</button>
        </div>
    );
};

export default MapComponent;