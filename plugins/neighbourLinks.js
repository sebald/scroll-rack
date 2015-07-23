var _ = require('lodash');

/**
 * A Metalsmith Plugin to add prev/next links to files.
 */
function NeighbourLinks () {

    // Define Metalsmith plugin
    function plugin ( files, metalsmith, done ) {
        var nav = metalsmith._metadata['nav'],
            predecessor;


        function createLinks ( items ) {
            _.forEach(items, function ( page ) {
                var current = files[page.name];
                if( predecessor ) {
                    current.prev = _.pick(predecessor, ['path', 'title']);
                    predecessor.next = _.pick(current, ['path', 'title']);
                }
                predecessor = current;
            });
        }


        // Before
       createLinks(nav.before);

        // Chapters
        _.forEach(nav.groups, function ( grp ) {
            createLinks(grp.items);
        });

        // After
        createLinks(nav.after);

        done();
    }

    return plugin;
}

module.exports = NeighbourLinks;