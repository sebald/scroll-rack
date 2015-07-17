var Token = require('../node_modules/metalsmith-markdownit/node_modules/markdown-it/lib/token');


// Render method to use with `markdown-it-anchor` plugin.
function renderPermalink ( slug, opts, tokens, idx ) {
    var text,
        link_open,
        link_close;

    // Anchor icon
    text = new Token('text', '', 0);
    text.content = '#';

    // <a>
    link_open = new Token('link_open', 'a', 1);
    link_open.attrs = [
        ['href', '#' +slug],
        ['aria-hidden', 'true']
    ];

    // </a>
    link_close = new Token('link_close', 'a', -1);

    // Add clas and append link
    tokens[idx].attrPush(['class', 'Header--withAnchor']);
    tokens[idx + 1].children.unshift(
        link_open,
        text,
        link_close
    );
}


module.exports = renderPermalink;