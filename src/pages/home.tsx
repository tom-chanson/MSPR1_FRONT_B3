import "../styles/home.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Button from "../components/bouton";
import { useEffect, useState } from "react";
import { AnnonceAttente } from "../interface";
import { route_api } from "../constants";
import { RequestHelperAuth, useAuth } from "../helpers/request";
import { Icon } from "leaflet";

export default function Home() {
  const initialCenter: [number, number] = [47.209499162, -1.5499978];
  const zoom = 13;
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [key, setKey] = useState<[number, number]>([0, 0]);
  const [annonces, setAnnonces] = useState<AnnonceAttente[]>([]);

  const updateUserPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userPosition: [number, number] = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      setCenter(userPosition);
      setKey((prevKey: [number, number]) => [prevKey[0] + 1, prevKey[1] + 1]);
    });
  };

  const authHeader = useAuth();

  const FetchAnnonce = () => {
    if (!authHeader) {
      return;
    }
    RequestHelperAuth<AnnonceAttente[]>(
      "GET",
      route_api.annonce_attente,
      authHeader
    )
      .then((response) => {
        if (response.status === 200) {
          setAnnonces(response.data);
        } else {
          console.error(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    FetchAnnonce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/6376/6376504.png",
    iconSize: [38, 38], // size of the icon
  });

  return (
    <>
      <div className="containerMap">
        <MapContainer
          center={center}
          zoom={zoom}
          className="map-container"
          key={key[0]}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {annonces.map((annonce) => (
            <Marker
              position={[
                parseFloat(annonce.utilisateur.adresse.latitude),
                parseFloat(annonce.utilisateur.adresse.longitude),
              ]}
              icon={customIcon}
              key={annonce.titre}
            >
              <Popup>{annonce.titre}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="containerButton">
        <Button
          label="Me localiser"
          color="#456654"
          textSize="20px"
          onClick={updateUserPosition}
        />
      </div>
    </>
  );
}
