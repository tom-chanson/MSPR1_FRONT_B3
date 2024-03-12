import { Button } from "@mui/material";
import { FaPencil } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ButtonEditSave(props: {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  onClick: (
    editMode: boolean,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => void;
  error?: boolean;
  loading?: boolean;
}) {
  return (
    <Button
      className="button-edit-save"
      variant="contained"
      type="button"
      disabled={props.loading}
      color={props.editMode ? (props.error ? "error" : "success") : "primary"}
      onClick={(e) => {
        props.onClick(props.editMode, e);
        if (!props.editMode) {
          props.setEditMode(true);
        }
      }}
    >
      {props.loading ? <AiOutlineLoading3Quarters className="loading" /> : null}{" "}
      {props.editMode
        ? props.loading
          ? " Enregistrement"
          : "Enregistrer"
        : "Modifier"}
      {props.editMode ? (
        <FaSave style={{ marginLeft: "0.5rem" }} />
      ) : (
        <FaPencil style={{ marginLeft: "0.5rem" }} />
      )}
    </Button>
  );
}
