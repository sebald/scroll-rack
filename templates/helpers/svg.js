var path = require('path'),
    fs = require('fs');

var SVG_PATH = path.join(
    __dirname,
    '../..',
    'assets/svg/'
);

module.exports = function ( name ) {
    var svg = fs.readFileSync(SVG_PATH + name + '.svg');
    return svg.toString();
};