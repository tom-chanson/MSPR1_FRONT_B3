import React, { useState, useRef, useEffect } from 'react';
import '../styles/editArticle.css';
import PreviewArticle from './previewArticle';
import NavbarEditArticle from '../components/navbarEditArticle/navbarEditArticle';
import { Article } from '../interface';
import { RequestHelperAuth } from '../helpers/request';
import { useParams } from 'react-router-dom';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';


export default function EditArticle() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [editorView, setEditorView] = useState("editor");
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const [markdownText, setMarkdownText] = useState('');
    const authHeader = useAuthHeader();

    useEffect(() => {
    if (params.id && loading && authHeader) {
        RequestHelperAuth<Article>('GET', '/article/' + params.id, authHeader).then((response) => {
            if (response.status === 200) {
                setLoading(false);
                setMarkdownText(response.data.contenu);
            } else {
                console.error(response);
                setLoading(false);
            }
        } ).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    } else {
        setLoading(false);
    }
}, [params.id, loading, authHeader]);



    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdownText(e.target.value);
        console.log(e.target.value);
    };

    // useEffect(() => {
    //     getArticle().then((text) => {
    //         setMarkdownText(text);
    //     });
    // }, []);


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