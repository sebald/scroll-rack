var _ = require('lodash');

function Metadata () {
    // Conform metalsmith API
    return function ( files, metalsmith, done ) {
        // Add path info to each file
        _.forEach(files, function ( f, path ) {
            files[path].path = path;
            // console.log(files[path]);
            // console.log('-------------------');
        });
        
        // Add build date
        metalsmith._metadata['build_date'] = new Date();
        
        done();
    };
}

module.exports = Metadata;