import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RequestHelper } from "../helpers/request";
import { Article } from "../interface";
import PreviewArticle from "./previewArticle";
import "../styles/markdown.css";
import "../styles/viewArticle.css";
import { route_api } from "../constants";
import { useSnackbar } from "notistack";

export default function ViewArticle() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [markdownText, setMarkdownText] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (params.id && loading) {
      RequestHelper<Article>("GET", route_api.article + params.id)
        .then((response) => {
          if (response.status === 200) {
            setLoading(false);
            console.log(response.data.contenu);
            setMarkdownText(response.data.contenu);
          } else {
            console.error(response);
            setLoading(false);
            enqueueSnackbar("Erreur lors du chargement de l'article", {
              variant: "error",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          enqueueSnackbar("Erreur lors du chargement de l'article", {
            variant: "error",
          });
        });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-view-article">
      <PreviewArticle markdownText={markdownText} />
    </div>
  );
}
