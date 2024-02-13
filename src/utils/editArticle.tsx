export function addInNewLine(char: string, cursorPositionAdd: number, textareaRef: React.RefObject<HTMLTextAreaElement>, setMarkdownText: (text: string) => void) {
    /* ajouter le caracère après avoir sauté une ligne */
    const textarea = textareaRef.current;
    if (!textarea) return;
    let cursorStart = textarea.selectionStart;
    /* placer le curseur à la fin de la ligne */
    while (cursorStart < textarea.value.length && textarea.value[cursorStart] !== '\n') {
        cursorStart++;
    }
    const text = textarea.value;
    const lines = text.split('\n');
    let currentLine = 0;
    let i = 0;
    while (i < cursorStart) {
        if (text[i] === '\n') {
            currentLine++;
        }
        i++;
    }
    const newLine = char;
    /* si la ligne actuelle on ajoute la char au lieu d'avoir une nouvelle ligne */
    if (lines[currentLine].length === 0) {
        lines[currentLine] = newLine;
    } else {
        lines.splice(currentLine + 1, 0, newLine);
    }
    const newCursorStart = cursorStart + newLine.length + cursorPositionAdd + 1;
    const newText = buildText(lines);
    textareaFocus(newCursorStart, newCursorStart, textareaRef);
    textarea.value = newText;
    setMarkdownText(newText);
}

export function buildText(text: string[]){
    let newText = '';
    for (let i = 0; i < text.length; i++) {
        newText += text[i];
        if (i < text.length - 1) {
            newText += '\n';
        }
    }
    return newText;
}

export function textareaFocus(cursorStart: number, cursorEnd: number, textareaRef: React.RefObject<HTMLTextAreaElement>) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.focus();
    setTimeout(() => {
        textarea.selectionStart = cursorStart;
        textarea.selectionEnd = cursorEnd;
    }, 1);
}

export function textArray(line: number, column: number) {
    /* créer le string pour un tableau en markdown */
    let textArray = '\n';
    textArray += addLine(column, 'entête');
    textArray += addLine(column, ':-----:');
    for (let i = 0; i < line; i++) {
        textArray += addLine(column, ' texte  ');
    }
    return textArray;
}

export function addLine(column: number, text: string) {
    let textArray = '';
    for (let i = 0; i < column; i++) {
        textArray += "| " + text + " ";
    }
    textArray += '|\n';
    return textArray;
}

export function addStyle (styleChar: string, textareaRef: React.RefObject<HTMLTextAreaElement>, setMarkdownText: (text: string) => void) {
    /* ajouter les caractères de style devant et derrière la sélection et retire le style si il est déjà présent */
    const textarea = textareaRef.current;
    if (!textarea) return;
    let cursorStart = textarea.selectionStart;
    let cursorEnd = textarea.selectionEnd;
    let removeStyle = false;

    const select = cursorStart === cursorEnd;
    const position = cursorStart;
    if (select) {
        while (cursorStart > 0 && textarea.value[cursorStart - 1] !== ' ' && textarea.value[cursorStart - 1] !== '\n') {
            cursorStart--;
        }
        while (cursorEnd < textarea.value.length && textarea.value[cursorEnd] !== ' ' && textarea.value[cursorEnd] !== '\n') {
            cursorEnd++;
        }
    }

    if (textarea.value.slice(cursorStart - styleChar.length, cursorStart) === styleChar) {
        cursorStart -= styleChar.length;
    }
    if (textarea.value.slice(cursorEnd, cursorEnd + styleChar.length) === styleChar) {
        cursorEnd += styleChar.length;
    }
    /* enlever les espaces avant et après la sélection */
    while (textarea.value[cursorStart] === ' ') {
        cursorStart++;
    }
    while (textarea.value[cursorEnd - 1] === ' ') {
        cursorEnd--;
    }

    const text = textarea.value;
    const selectedText = text.slice(cursorStart, cursorEnd);
    const textBefore = text.slice(0, cursorStart);
    const textAfter = text.slice(cursorEnd);
    let newText = '';
    if (selectedText.includes(styleChar)) {
        removeStyle = true;
        newText = selectedText.replaceAll(styleChar, '');
    } else {
        newText = styleChar + selectedText + styleChar;
    }
    let newCursorStart = cursorStart;
    let newCursorEnd = cursorEnd;
    if (!removeStyle) {
        newCursorStart += styleChar.length;
        newCursorEnd += styleChar.length;
        if (select) {
            newCursorStart = position + styleChar.length;
            newCursorEnd = newCursorStart;
        }
    } else {
        newCursorEnd -= styleChar.length * 2;
        if (select) {
            newCursorStart = position - styleChar.length;
            newCursorEnd = newCursorStart;
        }
    }

    textarea.value = textBefore + newText + textAfter;
    textareaFocus(newCursorStart, newCursorEnd, textareaRef);
    setMarkdownText(textarea.value);
}

export function addStartLine(char: string, textareaRef: React.RefObject<HTMLTextAreaElement>, setMarkdownText: (text: string) => void, patternReplace?: RegExp) {
    /* vérifier si le curseur de l'utilisateur est dans le textarea */
    const textarea = textareaRef.current;
    if (!textarea) return;
    /* récupérer la position du curseur */
    const cursorStart = textarea.selectionStart;
    const text = textarea.value;
    const lines = text.split('\n');
    let currentLine = 0;
    let i = 0;
    while (i < cursorStart) {
        if (text[i] === '\n') {
            currentLine++;
        }
        i++;
    }
    const length = lines[currentLine].length;
    /* vérifier si la ligne commence déjà par le caractère */
    if (lines[currentLine].slice(0, char.length) === char) {
        /* retirer le caractère de la ligne */
        lines[currentLine] = lines[currentLine].slice(char.length);
    } else {
        if (patternReplace) {
            lines[currentLine] = replaceTextFromRegex(patternReplace, lines[currentLine], '');
        }
        lines[currentLine] = char + lines[currentLine];
    }
    const newLength = lines[currentLine].length;
    const newCursorStart = cursorStart + (newLength - length);

    /* reconstruire le texte */
    const newText = buildText(lines);
    textareaFocus(newCursorStart, newCursorStart, textareaRef);
    textarea.value = newText;
    setMarkdownText(newText);
};

const replaceTextFromRegex = (regex: RegExp, text: string, textReplace: string) => {
    return text.replace(regex, textReplace);
}