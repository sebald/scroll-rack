var _ = require('lodash'),
    chalk = require('chalk'),
    log = require('./../helpers/log'),
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
                log(chalk.yellow('WARNING: Copy task needs a ' + chalk.italic('pattern') +
                    ' or ' + chalk.italic('files') + ' attribute!'));
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
                log(chalk.yellow('WARNING: Pattern ' + chalk.italic(item.pattern) +
                    ' did not match any files!'));
            }
        });
        done();
    }
}

module.exports = Copy;