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
            var list = [];
            if ( item.pattern ) {
                list = glob.sync(item.pattern);
            } else {
                console.log(('[scroll-rack]'.grey +' WARNING: "' +
                    'Copy task needs a "pattern" or "files" attribute!').yellow);
                return;
            }
            
            if( list.length ) {
                _.forEach(list, function ( filename ) {
                    var buffer, filepath;
                    
                    buffer = fs.readFileSync(filename);
                    filepath = path.join(item.target, path.basename(filename));
                    
                    // Rename
                    if( item.rename ) {
                        filepath = path.join(
                            path.dirname(filepath),
                            item.rename
                        );
                    }
                    
                    files[filepath] = {
                        contents: buffer
                    };
                });
            } else {
                console.log(('[scroll-rack]'.grey +' WARNING: Pattern "' +
                    item.pattern + '" did not match any files!').yellow);
            }
        });
        done();
    }
}

module.exports = Copy;