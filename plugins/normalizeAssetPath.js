var _ = require('lodash'),
    relativePath = require('./../templates/helpers/relative_path');

var LINK_EXP = /(?:href|src)=["'](\/?(assets\/[^"']+))["']/;

function NormalizeAssetPath () {

    return function plugin ( files, metalsmith, done ) {
        _.forEach( files, function ( file, path ) {
            var contents = file.contents.toString(),
                found = false;

            contents = contents.replace(LINK_EXP, function ( attr, value, link ) {
                found = true;
                return attr.replace(value, relativePath(path, link));
            });
            if( found ) {
                files[path].contents = new Buffer(contents);
            }
        });

        done();
    }
}

module.exports = NormalizeAssetPath;