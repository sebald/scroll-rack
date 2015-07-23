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
                    file: path
                });
            }

            // File IN the root directory
            else {
                console.log(file.nav, file.nav === 'after' ? 'after' : 'before');
                nav[file.nav === 'after' ? 'after' : 'before']
                    .push({
                        title: file.title,
                        path: path
                    });
            }
        });

        nav.groups = Object.keys(nav.groups)
            .map(function (key) {
                return { name: key, items: nav.groups[key] };
            })
            .sort(config.sort);

        // After everything is sorted, we can create next/prev links
        var predecessor;
        _.forEach(nav.groups, function ( grp, gi ) {
            _.forEach(grp.items, function ( item, idx ) {
                var current = files[item.file];

                if( predecessor ) {
                    current.prev = _.pick(predecessor, ['path', 'title']);
                    predecessor.next = _.pick(current, ['path', 'title']);
                }

                predecessor = current;
            });
        });

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