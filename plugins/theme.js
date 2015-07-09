var path = require('path');

function Theme ( name ) {
    return path.join(
        path.dirname(require.resolve('highlight.js')),
        '..',
        'styles',
        (name || 'zenburn') + '.css'
    );
}

module.exports = Theme;