var hljs = require('highlight.js')

function Escape (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
        try {
            return hljs.highlight(lang, str).value;
        } catch (__) {}
    }
    
    try {
        return hljs.highlightAuto(str).value;
    } catch (__) {}
    
    return ''; // use external default escaping
}

module.exports = Escape;