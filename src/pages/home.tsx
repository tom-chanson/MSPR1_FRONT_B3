import "../styles/home.css";
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import {LatLngExpression} from "leaflet";
import Button from "../components/bouton";
import {useState} from "react";


import {Icon} from "leaflet";

export default function Home() {

    const initialCenter: [number, number] = [47.209499162, -1.5499978];
    const zoom = 13;
    const [center, setCenter] = useState<[number, number]>(initialCenter);
    const [key, setKey] = useState<[number, number]>([0, 0]);

    const updateUserPosition = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const userPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
            setCenter(userPosition);
            setKey((prevKey: [number, number]) => [prevKey[0] + 1, prevKey[1] + 1]);
        });
    };


    const markers: [{ geocode: LatLngExpression, popUp: string }] = [
        {
            geocode: [48.86, 2.3522],
            popUp: "Titre de l'annonce"
        },
    ];

    const customIcon = new Icon({
        //
        //iconUrl: require("../assets/placeholder.png"),
        iconUrl: "https://cdn-icons-png.flaticon.com/512/6376/6376504.png",
        iconSize: [38, 38] // size of the icon
    });

    return (
        <>
        <div className="containerMap">
        <MapContainer center={center} zoom={zoom} className="map-container" key={key[0]}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map(marker => (
                <Marker position={marker.geocode} icon={customIcon} key={crypto.randomUUID()}>
                    <Popup>{marker.popUp}</Popup>
                </Marker>
            ))}
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
        </>
    );
}
