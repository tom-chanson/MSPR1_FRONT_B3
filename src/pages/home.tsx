import "../styles/home.css";
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import {LatLngExpression} from "leaflet";

import {Icon} from "leaflet";

export default function Home() {

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
        <MapContainer center={[48.8566, 2.3522]} zoom={13}>
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
    );
}
