const textarea = document.getElementById('markdown');
const preview = document.getElementById('preview');
const fileInput = document.getElementById('fileInput');
let lightMode = false;

function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.classList.toggle('show');
}

window.onclick = function(event) {
    if (!event.target.matches('#fileMenu') && !event.target.matches('#viewMenu')) {
        document.getElementById('menuOptions').classList.remove('show');
        document.getElementById('viewOptions').classList.remove('show');
    }
}

function handleMenuChange(action) {
    if (action === 'load') {
        fileInput.click();
    } else if (action === 'save') {
        saveMarkdown();
    } else if (action === 'saveAs') {
        saveMarkdownAs();
    }
}

function loadMarkdown() {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        textarea.value = e.target.result;
        updatePreview();
    }
    reader.readAsText(file);
}

function saveMarkdown() {
    const blob = new Blob([textarea.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveMarkdownAs() {
    const fileName = prompt('Enter file name', 'document.md');
    if (fileName) {
        const blob = new Blob([textarea.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

function updatePreview() {
    const markdownText = textarea.value;
    const html = marked(markdownText, {
        breaks: true,
        highlight: function(code, lang) {
            return hljs.highlightAuto(code, [lang]).value;
        }
    });
    preview.innerHTML = html;
    renderWarnings();
}

function toggleLightMode() {
    lightMode = !lightMode;
    document.body.classList.toggle('light-mode', lightMode);
    document.getElementById('menu').classList.toggle('light-mode', lightMode);
    document.getElementById('toolbar').classList.toggle('light-mode', lightMode);
    document.getElementById('markdown').classList.toggle('light-mode', lightMode);
    document.getElementById('line-numbers').classList.toggle('light-mode', lightMode);
}

function insertHeader(level) {
    const header = '#'.repeat(level) + ' ';
    insertTextAtCursor(header);
}

function insertEmphasis(type) {
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    const wrapper = type === 'bold' ? '**' : '*';
    const newText = wrapper + (selectedText.length > 0 ? selectedText : `emphasized text`) + wrapper;
    insertTextAtCursor(newText);
}

function insertList(type) {
    const listItem = type === 'unordered' ? '- ' : '1. ';
    insertTextAtCursor(listItem);
}

function insertLink() {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:');
    if (url && text) {
        const newText = `[${text}](${url})`;
        insertTextAtCursor(newText);
    }
}

function insertImage() {
    const url = prompt('Enter image URL:');
    const alt = prompt('Enter alt text:');
    if (url) {
        const newText = `![${alt || 'alt text'}](${url})`;
        insertTextAtCursor(newText);
    }
}

function insertCode() {
    const code = prompt('Enter code:');
    const language = prompt('Enter language (optional):');
    if (code) {
        const newText = `\`\`\`${language || ''}\n${code}\n\`\`\``;
        insertTextAtCursor(newText);
    }
}

function insertWarning() {
    const warningText = prompt('Enter warning text:');
    if (warningText) {
        const newText = `<div class="warning">${warningText}</div>`;
        insertTextAtCursor(newText);
    }
}

function insertStrikethrough() {
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    const newText = `~~${selectedText.length > 0 ? selectedText : "Strikethrough Text"}~~`;
    insertTextAtCursor(newText);
}

function insertTaskList() {
    const taskText = prompt("Enter task text:");
    if (taskText) {
        const newText = `- [ ] ${taskText}`;
        insertTextAtCursor(newText);
    }
}

function insertTOC() {
    const newText = `[TOC]`;
    insertTextAtCursor(newText);
}

function insertCustomContainer() {
    const containerType = prompt("Enter container type (e.g., tip, warning):");
    const containerText = prompt(`Enter ${containerType} text:`);
    if (containerType && containerText) {
        const newText = `:::${containerType}\n${containerText}\n:::\n`;
        insertTextAtCursor(newText);
    }
}

function insertSpoiler() {
    const spoilerText = prompt("Enter spoiler text:");
    if (spoilerText) {
        const newText = `||${spoilerText}||`;
        insertTextAtCursor(newText);
    }
}

function insertEmbedContent() {
    const embedURL = prompt("Enter embed URL:");
    if (embedURL) {
        const newText = `<iframe src="${embedURL}"></iframe>`;
        insertTextAtCursor(newText);
    }
}

function insertTextAtCursor(text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    textarea.value = value.substring(0, start) + text + value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
    updatePreview();
    updateLineNumbers();
}

function updateLineNumbers() {
    const lines = textarea.value.split('\n');
    let lineNumbersHtml = '';
    for (let i = 1; i <= lines.length; i++) {
        lineNumbersHtml += i + '\n';
    }
    document.getElementById('line-numbers').innerText = lineNumbersHtml;
}

function renderWarnings() {
    const warnings = document.querySelectorAll('.warning');
    warnings.forEach(warning => {
        warning.style.backgroundColor = lightMode ? '#f8d7da' : '#3d3d3d';
        warning.style.color = lightMode ? '#721c24' : '#f28b82';
        warning.style.border = lightMode ? '1px solid #f5c6cb' : '1px solid #f28b82';
    });
}

// Initial preview update
updatePreview();
updateLineNumbers();
