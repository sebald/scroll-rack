/// <reference path="../typings/tsd.d.ts"/>

var _ = require('lodash'),
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
            if ( err ) { throw err; }

            files[fileName] = {
                contents: result.css
            };
            
            if( result.map ) {
                files[fileName + '.map'] = {
                    contents: result.map
                };
            }
            
            done();
        });
    };
}

module.exports = Sass;