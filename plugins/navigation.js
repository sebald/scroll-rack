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
                    file: path
                });
            }
        });

        groups = Object.keys(groups)
            .map(function (key) {
                return { name: key, items: groups[key] };
            })
            .sort(config.sort);

        // After everything is sorted, we can create next/prev links
        _.forEach(groups, function ( grp, gi ) {
            var predecessor;

            _.forEach(grp.items, function ( item, idx ) {
                var current = files[item.file];

                if( predecessor ) {
                    current.prev = _.pick(predecessor, ['path', 'title']);
                    predecessor.next = _.pick(current, ['path', 'title']);
                }

                predecessor = current;
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