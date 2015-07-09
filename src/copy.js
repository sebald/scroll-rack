var _ = require('lodash'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs');

function Copy ( list ) {
    if( !Array.isArray(list) ) {
        list = [list];
    }
    
    // Conform metalsmith API
    return function ( files, metalsmith, done ) {
        _.forEach(list, function ( item ) {
            var list = glob.sync(item.pattern);
            
            if( list.length ) {
                _.forEach(list, function ( filename ) {
                    var buffer, filepath;
                    
                    buffer = fs.readFileSync(filename);
                    filepath = path.join(item.target, path.basename(filename));
                    files[filepath] = {
                        contents: buffer
                    };
                });
            } else {
                console.log(('[scroll-rack] WARNING: Pattern "' +
                    item.pattern + '" did not match any files!').yellow);
            }
        });
        done();
    }
}

module.exports = Copy;