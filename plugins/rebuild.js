var _ = require('lodash'),
    chalk = require('chalk'),
    gaze = require('gaze'),
    tinylr = require('tiny-lr'),
    request = require('request'),
    log = require('./../helpers/log'),

    watched = false;

function Rebuild ( config ) {
    if( !config.pattern ) {
        log(chalk.yellow('WARNING: No "pattern" to watch specified!'));
        return;
    }

    return function ( files, metalsmith, done ) {
        var plugin = this,
            port = isInteger(config.livereload) ? config.livereload : 35729;

        // Once
        if( watched ) {
            done();
            return;
        }
        watched = true;

        // Init watcher
        gaze(config.pattern, gazing);
        function gazing( err, watcher ) {
            log(chalk.white('Start watching files...'));
            _.forEach(config.pattern, function ( pat ) {
                log(chalk.cyan('Wachting: ') + chalk.white.italic(pat));
            });

            watcher.on('changed', function ( filepath ) {
                var rel_path = filepath.replace(metalsmith._source, '');
                log(chalk.green('File' + chalk.italic(rel_path) + 'has changed.'));
                log(chalk.white('Rebuilding project...'));
                metalsmith.build(function ( err ) {
                    if (err) { throw err; }
                    log(chalk.green('Rebuilding complete!'));

                    // Notify tinylr
                    request('http://localhost:' + port + '/changed?files=' + rel_path);
                });
            });

            // Deregister
            plugin.close = function () {
                if( watcher ) {
                    watcher.close();
                    watcher = null;
                }
            };
        }

        // Livereload
        if( config.livereload ) {
            tinylr().listen(port, function( err ) {
                if(err) {
                    return log(chalk.red(err));
                }
                log('Live reload server started on port: ' + port );
            });
        }

        done();
    };
}


function isInteger ( any ) {
    return any.livereload === parseInt(any, 10);
}


module.exports = Rebuild;