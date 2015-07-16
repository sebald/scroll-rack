var Token = require('../node_modules/metalsmith-markdownit/node_modules/markdown-it/lib/token');


// Render method to use with `markdown-it-anchor` plugin.
function renderPermalink ( slug, opts, tokens, idx ) {
    var text,
        link_open,
        link_close;

    // Store header text and clear content
    text = new Token('text', '', 0);
    text.content = tokens[idx+1].content;
    tokens[idx+1].content = '';

    // <a>
    link_open = new Token('link_open', 'a', 1);
    link_open.attrPush(['href', '#' +slug]);

    // </a>
    link_close = new Token('link_close', 'a', -1);

    // Add clas and append link
    tokens[idx].attrPush(['class', 'Header--withAnchor']);
    tokens[idx + 1].children = [
        link_open,
        text,
        link_close
    ];
}


module.exports = renderPermalink;