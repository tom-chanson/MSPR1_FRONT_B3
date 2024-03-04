import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";
import { buildText } from "../../utils/editArticle";
import { Article, ArticlePost } from "../../interface";
import { RequestHelperAuth, useAuth } from "../../helpers/request";
import { route_api } from "../../constants";
import { useNavigate } from "react-router-dom";

export default function ModalSave(props: {
  setMarkdownText: (text: string) => void;
  saveModalOpen: boolean;
  setSaveModalOpen: (open: boolean) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  idArticle?: string;
}) {
  const [titleArticle, setTitleArticle] = useState("");

  const setTitle = useCallback(() => {
    /* récupérer le titre de l'article (premier h1) */
    console.log("set title");
    const textarea = props.textareaRef.current;
    if (!textarea) {
      setTitleArticle("");
      return;
    }
    const text = textarea.value;
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].slice(0, 2) === "# ") {
        setTitleArticle(lines[i].slice(2));
        return;
      }
    }
    setTitleArticle("");
  }, [props.textareaRef]);

  useEffect(() => {
    if (props.saveModalOpen) {
      setTitle();
    }
  }, [props.saveModalOpen, setTitle]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleArticle(e.target.value);
    updateTitleMarkdown(e.target.value);
  };

  const navigate = useNavigate();
  const updateTitleMarkdown = (title: string) => {
    const textarea = props.textareaRef.current;
    if (!textarea) return;
    const text = textarea.value;
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].slice(0, 2) === "# ") {
        lines[i] = "# " + title;
        const newText = buildText(lines);
        textarea.value = newText;
        props.setMarkdownText(newText);
        return;
      }
    }
    const newText = "# " + title + "\n" + text;
    textarea.value = newText;
    props.setMarkdownText(newText);
  };

  const authHeader = useAuth();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.setSaveModalOpen(false);
    if (authHeader) {
      const formData: ArticlePost = {
        titre: titleArticle,
        contenu: props.textareaRef.current!.value,
      };
      const url = props.idArticle
        ? route_api.article + props.idArticle
        : route_api.create_article;
      RequestHelperAuth<Article>("POST", url, authHeader, formData)
        .then((response) => {
          if (response.status === 200) {
            console.log("article sauvegardé");
            navigate("/article/" + response.data.id);
          } else {
            console.warn(response);
          }
        })
        .catch((error) => {
          console.warn(error);
        });
    }
  };

  return (
    <Modal
      open={props.saveModalOpen}
      className="modal modal-form"
      onClose={() => props.setSaveModalOpen(false)}
    >
      <form className="modal-content" onSubmit={handleSubmit}>
        <h2>Sauvegarder</h2>
        <div className="modal-form-input">
          <TextField
            label="Nom de l'article"
            type="text"
            required
            autoFocus
            value={titleArticle}
            onChange={handleTitleChange}
          />
        </div>
        <span>
          Modifer le titre de l'article modifie le premier titre de niveau 1
        </span>
        <div className="modal-form-buttons">
          <Button type="submit" color="success" variant="contained">
            Valider
          </Button>
          <Button
            onClick={() => props.setSaveModalOpen(false)}
            color="error"
            variant="contained"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
}
