import "../styles/listArticle.css";
import { Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Fab from "@mui/material/Fab";
import { ListArticleOrderByAlphabet, Article } from "../interface";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { route_api } from "../constants";
import { RequestHelper } from "../helpers/request";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "../components/bouton";

export default function ListArticle() {
  const navigate = useNavigate();
  const [listArticleOrderByAlphabet, setListArticleOrderByAlphabet] =
    useState<ListArticleOrderByAlphabet>({});
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [resultNumberSearch, setResultNumberSearch] = useState<number>(0);

  const [listArticle, setListArticle] = useState<
    { name: string; id: number }[]
  >([]);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

  const fetchListArticle = () => {
    RequestHelper<Article[]>("GET", route_api.list_articles)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          const listArticleTemp: { name: string; id: number }[] = [];
          response.data.forEach((article) => {
            listArticleTemp.push({ name: article.titre, id: article.id });
          });
          setListArticle(listArticleTemp);
        } else {
          console.error(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchListArticle();
  }, []);

  useEffect(() => {
    const listArticleOrderByAlphabetTemp: ListArticleOrderByAlphabet = {};
    let resultNumberSearchTemp = 0;
    listArticle.forEach((article) => {
      let firstLetter = article.name[0].toUpperCase();
      if (!alphabet.includes(firstLetter)) {
        firstLetter = "#";
      }
      if (
        !search ||
        article.name.toLowerCase().includes(search.toLowerCase())
      ) {
        if (!listArticleOrderByAlphabetTemp[firstLetter]) {
          listArticleOrderByAlphabetTemp[firstLetter] = [];
        }
        const articleName =
          article.name[0].toUpperCase() + article.name.slice(1);
        listArticleOrderByAlphabetTemp[firstLetter].push({
          name: articleName,
          id: article.id,
        });
        resultNumberSearchTemp++;
      }
      for (const letter in listArticleOrderByAlphabetTemp) {
        listArticleOrderByAlphabetTemp[letter] = orderArticle(
          listArticleOrderByAlphabetTemp[letter]
        );
      }
    });
    setResultNumberSearch(resultNumberSearchTemp);
    setListArticleOrderByAlphabet(listArticleOrderByAlphabetTemp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listArticle, search]);

  const orderArticle = (listArticle: { name: string; id: number }[]) => {
    /* trier les articles par ordre alphabétique */
    return listArticle.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    if (searchInput.length > 1) {
      setSearch(searchInput);
    } else {
      setSearch("");
    }
  }, [searchInput]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& label": {
              color: "white",
            },
            "& label.Mui-focused": {
              color: "white",
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiInputBase-input:hover": {
              borderColor: "white",
            },
            "& .MuiInputBase-input:focus": {
              borderColor: "white",
            },
            "& .MuiInputBase-input:active": {
              borderColor: "white",
            },
          },
        },
      },
    },
  });

  return (
    <div className="container-list-article">
      <div className="list-letter">
        {alphabet.map((letter) => {
          if (listArticleOrderByAlphabet[letter]) {
            return (
              <a key={crypto.randomUUID()} href={"#" + letter}>
                {letter}
              </a>
            );
          }
          return null;
        })}
      </div>

      <ThemeProvider theme={theme}>
        <div className="search">
          <Autocomplete
            id="search-article"
            freeSolo
            options={listArticle.map((option) => option.name)}
            onChange={(event, value) => {
              setSearch(value ? value : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search input"
                InputProps={{
                  ...params.InputProps,
                }}
                onChange={(event) => setSearchInput(event.target.value)}
                value={searchInput}
                className="search-input"
              />
            )}
          />
          <p>
            {resultNumberSearch} résultat{resultNumberSearch > 1 ? "s" : ""}
          </p>
        </div>
      </ThemeProvider>
      <Button
        label="Créer un article"
        color="#456654"
        textSize="20px"
        onClick={() => navigate("/edit-article")}
      />
      {alphabet.map((letter) => {
        if (listArticleOrderByAlphabet[letter]) {
          return (
            <div
              key={crypto.randomUUID()}
              className="container-letter"
              id={letter}
            >
              <div className="separator-article"></div>
              <h2>{letter}</h2>
              <div className="list-article">
                {listArticleOrderByAlphabet[letter].map((article, _) => {
                  return (
                    <Tooltip
                      key={crypto.randomUUID()}
                      title={article.name}
                      arrow
                    >
                      <Link to={"/article/" + article.id} className="article">
                        <h3>{article.name}</h3>
                      </Link>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          );
        }
        return null;
      })}
      <Fab
        color="primary"
        aria-label="scroll to top"
        onClick={scrollToTop}
        className="scroll-to-top"
        size="small"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </div>
  );
}
