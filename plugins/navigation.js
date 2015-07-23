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
        var nav = {
                groups: {},
                before: [],
                after: []
            },
            dir;

        _.forEach(files, function ( file, path, idx ) {
            dir = path.match(/^(?:\.\/)?([^/]+)\/.*/);

            // Files that are NOT in the root directory
            if( dir ) {
                dir = dir[1];

                if ( !nav.groups[dir] ) {
                    nav.groups[dir] = [];
                }

                nav.groups[dir].push({
                    title: file.title,
                    path: path.replace(/index\.html$/, ''),
                    name: path
                });
            }

            // File IN the root directory
            else {
                nav[file.nav === 'after' ? 'after' : 'before']
                    .push({
                        title: file.title,
                        path: path,
                        name: path
                    });
            }
        });

        // Sort groups
        nav.groups = Object.keys(nav.groups)
            .map(function (key) {
                return { name: key, items: nav.groups[key] };
            })
            .sort(config.sort);

        metalsmith._metadata['nav'] = nav;
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