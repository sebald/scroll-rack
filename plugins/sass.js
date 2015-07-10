/// <reference path="../typings/tsd.d.ts"/>

var _ = require('lodash'),
    chalk = require('chalk'),
    log = require('./../helpers/log'),
    path = require('path'),
    sass = require('node-sass');

function Sass ( config ) {
    // Helpers
    function parseFileName ( filePath ) {
        var file = path.basename(filePath);
        return file.replace(/.s[ca]ss$/, '.css');
    }

    // Conform metalsmith API
    return function ( files, metalsmith, done ) {
        var fileName;

        // Normalize settings
        config.file = metalsmith.path(config.file);
        config.outputDir = config.outDir || './' ;
        config.outFile = path.join(
            config.outputDir,
            parseFileName(config.file)
        );
        fileName = config.outFile; // node-sass messes with the config >.<

        sass.render( config, function ( err, result ) {
            if ( err ) {
                log(
                    chalk.red('ERROR: Sass could not be compiled!\n\n') +
                    chalk.red(err)
                );

                // Use previous sass build if possible.
                if( metalsmith._metadata['sass_backup'] ) {
                    log(chalk.white('Using last sass build.'))
                    result = metalsmith._metadata['sass_backup'];
                }
            }

            files[fileName] = {
                contents: result.css
            };

            if( result.map ) {
                files[fileName + '.map'] = {
                    contents: result.map
                };
            }

            // Write a backup fale in case next time rendering fails.
            metalsmith._metadata['sass_backup'] = {
                css: result.css,
                map: result.map
            };

            done();
        });
    };
}

module.exports = Sass;