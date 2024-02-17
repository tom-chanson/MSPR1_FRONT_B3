import "../styles/listArticle.css";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Fab from '@mui/material/Fab';
import { ListArticleOrderByAlphabet, ListeArticle } from "../interface";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { route_api } from "../constants";
import { RequestHelper } from '../helpers/request';


export default function ListArticle() {
    
    const [listArticleOrderByAlphabet, setListArticleOrderByAlphabet] = useState<ListArticleOrderByAlphabet>({});
    const [search, setSearch] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [resultNumberSearch, setResultNumberSearch] = useState<number>(0);

    const [listArticle, setListArticle] = useState<string[]>([]);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split('');


    
    const fetchListArticle = () => {
        RequestHelper<ListeArticle>('GET', route_api.list_articles).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                const listArticleTemp: string[] = [];
                response.data.articles.forEach((article) => {
                    listArticleTemp.push(article.titre);
                });
                setListArticle(listArticleTemp);
            } else {
                console.error(response);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        fetchListArticle();
    }, []);

    
    
    useEffect(() => {
        const listArticleOrderByAlphabetTemp: ListArticleOrderByAlphabet = {};
        let resultNumberSearchTemp = 0;
        listArticle.forEach((article) => {
        let firstLetter = article[0].toUpperCase();
        if (!alphabet.includes(firstLetter)) {
            firstLetter = "#";
        }
        if (!search || article.toLowerCase().includes(search.toLowerCase())) {
            if (!listArticleOrderByAlphabetTemp[firstLetter]) {
                listArticleOrderByAlphabetTemp[firstLetter] = [];
            }
            const articleName = article[0].toUpperCase() + article.slice(1);
            listArticleOrderByAlphabetTemp[firstLetter].push(articleName);
            resultNumberSearchTemp++;
        }
        for (const letter in listArticleOrderByAlphabetTemp) {
            listArticleOrderByAlphabetTemp[letter] = orderArticle(listArticleOrderByAlphabetTemp[letter]);
        }
    });
    setResultNumberSearch(resultNumberSearchTemp);
    setListArticleOrderByAlphabet(listArticleOrderByAlphabetTemp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listArticle, search]);

    const orderArticle = (listArticle: string[]) => {
        /* trier les articles par ordre alphabétique */
        return listArticle.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
            return 0;
        });
    }

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
            behavior: "smooth"
        });
    };
    
    return (
        <div className="container-list-article">
            <div className="list-letter">
                {alphabet.map((letter) => {
                    if (listArticleOrderByAlphabet[letter]) {
                        return (
                            <a key={crypto.randomUUID()} href={'#' + letter}>{letter}</a>
                        );
                    }
                    return null;
                }
                )}
            </div>

            <div className="search">
                <Autocomplete id="search-article" freeSolo options={listArticle} 
                onChange={(event, value) => {setSearch(value ? value : ""); }}
                renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            InputProps={{
              ...params.InputProps,
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            value={searchInput}
          />
        )}
 />
 <p>{resultNumberSearch} résultat{resultNumberSearch > 1 ? "s" : ""}</p>

            </div>
            {alphabet.map((letter) => {
                if (listArticleOrderByAlphabet[letter]) {
                    return (
                        <div key={crypto.randomUUID()} className="container-letter" id={letter}>
                            <div className="separator-article"></div>
                            <h2>{letter}</h2>
                            <div className="list-article">
                                {listArticleOrderByAlphabet[letter].map((article, _) => {
                                    return (
                                        <Tooltip key={crypto.randomUUID()} title={article} arrow>
                                            <Link to={'/article/' + article} className="article"><h3>{article}</h3></Link>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }
                return null;
            })}
            <Fab color="primary" aria-label="scroll to top" onClick={scrollToTop} className="scroll-to-top" size="small">
                <KeyboardArrowUpIcon />
            </Fab>
        </div>
    );
}