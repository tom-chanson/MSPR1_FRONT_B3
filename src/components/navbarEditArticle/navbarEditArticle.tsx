import '../../styles/navbarEditArticle.css'
import React, { useState, useRef, useEffect, useCallback } from 'react'

import { faHeading, faBold, faItalic, faStrikethrough, faQuoteRight, faLink, faTableColumns, faEye, faRectangleList, faFloppyDisk, faSection, faImage, faImages, faBookBookmark } from '@fortawesome/free-solid-svg-icons'
import ItemMenuEditArticle from './itemMenuEditArticle'
import ItemSubmenuEditArticle from './itemSubmenuEditArticle'
import SubmenuEditArticle from './submenuEditArticle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LibraryImage from './libraryImage';
import ModalSave from './modalSave';
import { textArray, addInNewLine, addStyle, addStartLine } from '../../utils/editArticle';
import ModalArray from './modalArray';




export default function NavbarEditArticle(props: { textareaRef: React.RefObject<HTMLTextAreaElement>, setMarkdownText: (text: string) => void, setView: (view: string) => void, idArticle?: string}) {
    const listTitleTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const refSubmenuTitleType = useRef<HTMLUListElement>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [libraryModalOpen, setLibraryModalOpen] = useState(false);    

    


    
    const hideSubmenu = (subMenuRef: React.RefObject<HTMLUListElement>) => {
        if (subMenuRef.current) {
            subMenuRef.current.classList.remove("show-submenu");
        }
    }

    const showSubmenu = (subMenuRef: React.RefObject<HTMLUListElement>) => {
        if (subMenuRef.current) {
            subMenuRef.current.classList.add("show-submenu");
        }
    }

    const addMarkdownStartLine = useCallback((startLine: string, regex?: RegExp) => {
        addStartLine(startLine, props.textareaRef, props.setMarkdownText, regex);
    }, [props]);

    const handleClickTitleType = useCallback((index: number) => {
        hideSubmenu(refSubmenuTitleType);
        addMarkdownStartLine('#'.repeat(index + 1) + ' ', /^#{1,6} /);
    }, [addMarkdownStartLine, refSubmenuTitleType]);

    const arrayXbyY = useCallback(() => {
        setModalOpen(true);
    }, []);

    const [viewNumber, setViewNumber] = useState(0);
    const listViews = ['preview', 'editor', 'edit'];
    const listViewsPhone = ['preview', 'edit'];
    const [listViewsActive, setListViewsActive] = useState(window.innerWidth < 720 ? listViewsPhone : listViews);
    const [editorViewActive, setEditorViewActive] = useState(false);


    const changeView = useCallback(() => {
        const updateViewNumber = (viewNumber + 1) % listViewsActive.length;
        setViewNumber(updateViewNumber);
        props.setView(listViewsActive[updateViewNumber]);
        if (listViewsActive[updateViewNumber] === 'preview') {
            setEditorViewActive(false);
        } else {
            setEditorViewActive(true);
        }
    }, [listViewsActive, props, viewNumber]);

    const [isPhone, setIsPhone] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 720) {
                if (!isPhone) {
                    setIsPhone(true);
                    setListViewsActive(listViewsPhone);
                }
            } else {
                if (isPhone) {
                    setIsPhone(false);
                    setListViewsActive(listViews);
                }
            }
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPhone, listViewsActive]);

    const addStyleMarkdown = useCallback((styleChar: string) => {
        addStyle(styleChar, props.textareaRef, props.setMarkdownText);
    } ,[props]);

    useEffect(() => {
        changeView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listViewsActive]);

    const bold = useCallback(() => {
        addStyleMarkdown('**');
    }, [addStyleMarkdown]);

    const italic = useCallback(() => {
        addStyleMarkdown('_');
    }, [addStyleMarkdown]);

    const strikethrough = useCallback(() => {
        addStyleMarkdown('~~');
    }, [addStyleMarkdown]);

    const quote = useCallback(() => {
        addMarkdownStartLine('> ');
    }, [addMarkdownStartLine]);

    const addLine = useCallback((text: string, cursorPositionAdd: number) => {
        addInNewLine(text, cursorPositionAdd, props.textareaRef, props.setMarkdownText);
    } ,[props]);

    const link = useCallback(() => {
        addLine('[lien](https://)', -1);
    }, [addLine]);

    const array = useCallback(() => {
        arrayXbyY();
    }, [arrayXbyY]);

    const save = useCallback(() => {
        setSaveModalOpen(true);
    }, []);
    

    /* ajouté des racourcis clavier */
    useEffect(() => {
        const listShortcuts: { key: string, action: () => void, alwaysActive?:boolean }[] = [
            { key: 'b', action: () => bold() },
            { key: 'i', action: () => italic() },
            { key: 'd', action: () => strikethrough() },
            { key: 'q', action: () => quote() },
            { key: 'l', action: () => link() },
            { key: 'm', action: () => array() },
            { key: ' ', action: () => changeView(), alwaysActive: true },
            { key: 's', action: () => save(), alwaysActive: true },
            { key: '1', action: () => handleClickTitleType(0) },
            { key: '&', action: () => handleClickTitleType(0) },
            { key: '2', action: () => handleClickTitleType(1) },
            { key: 'é', action: () => handleClickTitleType(1) },
            { key: '3', action: () => handleClickTitleType(2) },
            { key: '"', action: () => handleClickTitleType(2) },
            { key: '4', action: () => handleClickTitleType(3) },
            { key: '\'', action: () => handleClickTitleType(3) },
            { key: '5', action: () => handleClickTitleType(4) },
            { key: '(', action: () => handleClickTitleType(4) },
            { key: '6', action: () => handleClickTitleType(5) },
            { key: '-', action: () => handleClickTitleType(5) },
            ];
        
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                /* sélectionner le bon raccourci */
                const shortcut = listShortcuts.find(shortcut => shortcut.key === event.key);
                if (shortcut) {
                    /* exécuter l'action du raccourci */
                    event.preventDefault();
                    if (shortcut.alwaysActive || editorViewActive) {                        
                        shortcut.action();
                    }
                }
            }
        }
        
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    } ,[array, bold, changeView, editorViewActive, handleClickTitleType, italic, link, quote, save, strikethrough]);

    return (
        <div className='navbar-edit-article'>
            <ul className='navbar-list action-edit'>
                <ItemMenuEditArticle tooltip='Mettre en gras (ctrl + b)' actionOnClick={bold} icon={faBold}/>
                <ItemMenuEditArticle tooltip='Mettre en italique (ctrl + i)' actionOnClick={italic} icon={faItalic}/>
                <ItemMenuEditArticle tooltip='Mettre en barré (ctrl + d)' actionOnClick={strikethrough} icon={faStrikethrough}/>
                <ItemMenuEditArticle tooltip='Mettre en citation (ctrl + q)' actionOnClick={quote} icon={faQuoteRight}/>
                <li className='separator'></li>
                <SubmenuEditArticle 
                icon={faHeading} 
                actionOnMouseEnter={(subMenu: React.RefObject<HTMLUListElement>) => showSubmenu(subMenu)} 
                actionOnMouseLeave={(subMenu: React.RefObject<HTMLUListElement>) => hideSubmenu(subMenu)} 
                actionOnClickSubmenu={(subMenu: React.RefObject<HTMLUListElement>) => hideSubmenu(subMenu)}
                listSubmenu={listTitleTypes.map((title, index) => {
                    return (
                        <ItemSubmenuEditArticle key={crypto.randomUUID()} actionOnClick={() => handleClickTitleType(index)} content={title} tooltip={`Insérer un titre de niveau ${index + 1} (ctrl + ${index + 1}})`} />
                    )
                })} />
                <SubmenuEditArticle
                icon={faImages}
                actionOnMouseEnter={(subMenu: React.RefObject<HTMLUListElement>) => showSubmenu(subMenu)}
                actionOnMouseLeave={(subMenu: React.RefObject<HTMLUListElement>) => hideSubmenu(subMenu)}
                actionOnClickSubmenu={(subMenu: React.RefObject<HTMLUListElement>) => hideSubmenu(subMenu)}
                listSubmenu={[
                    <ItemSubmenuEditArticle actionOnClick={() => addLine('![image](https://)', -1)} content={<FontAwesomeIcon icon={faImage}/>} tooltip='Insérer un lien vers une image' key={crypto.randomUUID()} />,
                    <ItemSubmenuEditArticle actionOnClick={() => setLibraryModalOpen(true)} content={<FontAwesomeIcon icon={faBookBookmark}/>} tooltip="Bibliothèque d'image" key={crypto.randomUUID()} />
                ]} />
                <ItemMenuEditArticle tooltip='Insérer un lien (ctrl + l)' actionOnClick={link} icon={faLink} />
                <SubmenuEditArticle
                icon={faTableColumns}
                actionOnMouseEnter={(subMenu: React.RefObject<HTMLUListElement>) => showSubmenu(subMenu)}
                actionOnMouseLeave={(subMenu: React.RefObject<HTMLUListElement>) => hideSubmenu(subMenu)}
                actionOnClickSubmenu={(subMenu: React.RefObject<HTMLUListElement>) => hideSubmenu(subMenu)}
                listSubmenu={[
                    <ItemSubmenuEditArticle actionOnClick={() => addLine(textArray(2,2), -1)} content='2x2' tooltip='Insérer un tableau 2x2' key={crypto.randomUUID()} />,
                    <ItemSubmenuEditArticle actionOnClick={() => addLine(textArray(3,2), -1)} content='3x2' tooltip='Insérer un tableau 3x2' key={crypto.randomUUID()} />,
                    <ItemSubmenuEditArticle actionOnClick={() => addLine(textArray(2,3), -1)} content='2x3' tooltip='Insérer un tableau 2x3' key={crypto.randomUUID()} />,
                    <ItemSubmenuEditArticle actionOnClick={() => addLine(textArray(3,3), -1)} content='3x3' tooltip='Insérer un tableau 3x3' key={crypto.randomUUID()} />,
                    <ItemSubmenuEditArticle actionOnClick={() => arrayXbyY()} content='?x?' tooltip='Insérer un tableau personnalisé' key={crypto.randomUUID()} />,
                ]} />
                <ItemMenuEditArticle tooltip='Insérer un sommaire' actionOnClick={() => addLine('## Sommaire\n', 1)} icon={faRectangleList} />
                <ItemMenuEditArticle tooltip='Insérer une section' actionOnClick={() => addLine('\n---\n', 1)} icon={faSection} />
            </ul>
            <ul className='navbar-list action-control'>
                <li className='separator'></li>
                <ItemMenuEditArticle tooltip='Changer de vue' actionOnClick={changeView} icon={faEye} />
                <ItemMenuEditArticle tooltip='Sauvegarder' actionOnClick={save} icon={faFloppyDisk} />
            </ul>
            <ModalArray setMarkdownText={props.setMarkdownText} modalOpen={modalOpen} setModalOpen={setModalOpen} textareaRef={props.textareaRef} />
            <ModalSave textareaRef={props.textareaRef} saveModalOpen={saveModalOpen} setSaveModalOpen={setSaveModalOpen} setMarkdownText={props.setMarkdownText} idArticle={props.idArticle} />
            <LibraryImage open={libraryModalOpen} setOpen={setLibraryModalOpen} addInNewLine={addLine} />
        </div>
    )
}