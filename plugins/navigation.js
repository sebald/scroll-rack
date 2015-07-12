/// <reference path="../typings/tsd.d.ts"/>

var _ = require('lodash');


function Navigation ( options ) {
    var defaults,
        config;

    defaults = {
        sort: compare
    };
    config = _.assign(defaults, options);

    // Conform metalsmith API
    return function ( files, metalsmith, done ) {
        var groups = {},
            dir;

        _.forEach(files, function ( file, path, idx ) {
            dir = path.match(/^(?:\.\/)?([^/]+)\/.*/);

            // Ignore files on root directory
            if( dir ) {
                dir = dir[1];

                if ( !groups[dir] ) {
                    groups[dir] = [];
                }

                groups[dir].push({
                    title: file.title,
                    path: path.replace(/index\.html$/, ''),
                    ref: path
                });
            }
        });

        groups = Object.keys(groups)
            .map(function (key) {
                return { name: key, items: groups[key] };
            })
            .sort(config.sort);

        // After everything is sorted, we can create next/prev links
        _.forEach(groups, function ( grp ) {
            _.forEach(grp.items, function ( item, idx ) {
                var file = files[item.ref];
                file.prev = (idx > 0) ? grp.items[idx - 1].ref : null;
                file.next = (idx < grp.items.length-1) ? grp.items[idx + 1].ref : null;
            });
        });

        metalsmith._metadata['nav'] = groups;
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