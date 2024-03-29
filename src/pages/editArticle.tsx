import React, { useState, useRef, useEffect } from 'react';
import '../styles/editArticle.css';
import PreviewArticle from './previewArticle';
import NavbarEditArticle from '../components/navbarEditArticle/navbarEditArticle';
import { Article } from '../interface';
import { RequestHelperAuth, useAuth } from '../helpers/request';
import { useParams } from 'react-router-dom';
import { templateArticle } from '../constants';
import { route_api } from '../constants';
import { useSnackbar } from 'notistack';

export default function EditArticle() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [editorView, setEditorView] = useState("editor");
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const [markdownText, setMarkdownText] = useState('');
    const authHeader = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
    if (params.id && loading && authHeader) {
        RequestHelperAuth<Article>('GET', route_api.article + params.id, authHeader).then((response) => {
            if (response.status === 200) {
                setLoading(false);
                setMarkdownText(response.data.contenu);
                enqueueSnackbar('Article chargé avec succès', { variant: 'success' });
            } else {
                console.error(response);
                setLoading(false);
                enqueueSnackbar('Erreur lors du chargement de l\'article', { variant: 'error' });
            }
        } ).catch((error) => {
            console.error(error);
            setLoading(false);
            enqueueSnackbar('Erreur lors du chargement de l\'article', { variant: 'error' });
        });
    } else {
        setLoading(false);
        setMarkdownText(templateArticle);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [params.id, authHeader]);



    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdownText(e.target.value);
    };

    return (
        <div className='container-page'>
            <div className={"container-edit-preview-article view-" + editorView + "-article"}>
                <NavbarEditArticle textareaRef={textareaRef} setMarkdownText={setMarkdownText} setView={setEditorView} idArticle={params.id}/>
                <div className='container-edit-article'>
                    <textarea
                        value={markdownText}
                        onChange={handleInputChange}
                        spellCheck={false}
                        ref={textareaRef}
                    />
                </div>
                <PreviewArticle markdownText={markdownText} />
            </div>
        </div>
    )
}