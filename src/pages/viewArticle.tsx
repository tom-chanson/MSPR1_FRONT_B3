import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RequestHelper } from '../helpers/request';
import { Article } from '../interface';
import PreviewArticle from './previewArticle';
import '../styles/markdown.css'
import '../styles/viewArticle.css'
import { route_api } from '../constants';


export default function ViewArticle() {
const params = useParams();
const [loading, setLoading] = useState(true);
const [markdownText, setMarkdownText] = useState('');


useEffect(() => {
    if (params.id && loading) {
        RequestHelper<Article>('GET', route_api.article + params.id).then((response) => {
            if (response.status === 200) {
                setLoading(false);
                console.log(response.data.contenu);
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
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

return (
    <div className='container-view-article'>
        <PreviewArticle markdownText={markdownText} />
    </div>
)
}
