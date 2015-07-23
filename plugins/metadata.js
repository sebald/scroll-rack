var _ = require('lodash');

function Metadata ( options ) {
    // Conform metalsmith API
    return function ( files, metalsmith, done ) {
        // Add path info to each file
        _.forEach(files, function ( f, path ) {
            files[path].path = path;
        });

        // Add build date
        metalsmith._metadata['build_date'] = new Date();
        // Inject livereload?
        metalsmith._metadata['livereload'] = options.flags.indexOf('serve') !== -1;
        done();
    };
}

module.exports = Metadata;