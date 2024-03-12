import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { Feature, Adresse, AddresseApi } from "../interface";

export default function InputAdress(props: {
  setAdresse: (adresse: Adresse) => void;
  disabled?: boolean;
  adresse?: Adresse;
}) {
  const addressString = props.adresse ? props.adresse.adresse : "";
  const [inputValue, setInputValue] = useState<string>(addressString);
  const [options, setOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<Feature[]>([]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions([]);
      return undefined;
    }

    setLoading(true);
    if (inputValue.length < 4) {
      return undefined;
    }

    (async () => {
      try {
        const response = await axios.get<AddresseApi>(
          `https://api-adresse.data.gouv.fr/search/?q=${inputValue}&limit=5&type=housenumber`
        );

        if (active) {
          setOptions(
            response.data.features.map(
              (feature: Feature) => feature.properties.label
            )
          );
          setResponseData(response.data.features);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    setLoading(false);

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Autocomplete
      noOptionsText="Aucune adresse trouvée"
      loadingText="Recherche en cours..."
      id="adresse"
      open={open}
      value={props.adresse ? props.adresse.adresse : undefined}
      disabled={props.disabled}
      isOptionEqualToValue={(option, value) => {
        return option === value || value === "";
      }}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, value) => {
        console.log(value);
        if (value === null || value === "") {
          props.setAdresse({
            latitude: "0",
            longitude: "0",
            adresse: "",
          });
          return;
        }
        const adresse = responseData.find(
          (adresse) => adresse.properties.label === value
        );
        console.log("addresse");
        console.log(adresse);
        console.log(props.adresse ? props.adresse.adresse : "");
        if (adresse) {
          props.setAdresse({
            latitude: adresse.geometry.coordinates[1].toString(),
            longitude: adresse.geometry.coordinates[0].toString(),
            adresse: adresse.properties.label,
          });
        } else {
          props.setAdresse({
            latitude: "0",
            longitude: "0",
            adresse: "",
          });
        }
      }}
      options={options}
      loading={loading}
      clearOnEscape
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Adresse"
          className="test"
          required
          disabled={props.disabled}
        />
      )}
    />
  );
}
