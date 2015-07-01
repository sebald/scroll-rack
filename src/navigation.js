/// <reference path="../typings/tsd.d.ts"/>

var _ = require('lodash');


function Navigation ( options ) {
    var defaults,
        config;
        
    defaults = {
        name: 'nav',
        sort: compare
    };
    config = _.assign(defaults, options);

    // Conform metalsmith API
    return function ( files, metalsmith, done ) {
        var groups = {},
            dir;
        
        _.forEach(files, function ( file, path ) {
            dir = path.match(/^(?:\.\/)?([^/]+)\/.*/);
            
            // Ignore files on root directory
            if( dir ) {
                dir = dir[1];
                
                if ( !groups[dir] ) {
                    groups[dir] = [];
                }
                
                groups[dir].push({
                    title: file.title,
                    path: path
                });
            }
        });
        
        groups = Object.keys(groups)
            .map(function (key) { 
                return { name: key, items: groups[key] }; 
            })
            .sort(config.sort);

        metalsmith._metadata[config.name] = groups;
        done();
    }
    
    
    
    function compare ( a, b ) {
        var na = a.name.toLowerCase(),
            nb = b.name.toLowerCase();
            
        // Sort by order if specified
        if( _.isArray(config.order) ) {
            return config.order.indexOf(na) - config.order.indexOf(nb);
        }
        
        // Fallback sort by group name
        return na.localeCompare(nb);
    }
}

module.exports = Navigation;