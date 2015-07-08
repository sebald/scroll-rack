var path = require('path');

module.exports = function ( current, target ) {
    var rel_path;
    current = path.normalize(current).slice(0);
    target = path.normalize(target).slice(0);
    current = path.dirname(current);
    rel_path = path.relative(current, target);
    return rel_path;
};