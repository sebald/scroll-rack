/// <reference path="../typings/tsd.d.ts"/>

var _ = require('lodash'),
    fs = require('fs'),
    Handlebars = require('handlebars');


function Sections ( options ) {
    var defaults,
        config;
        
    defaults = {
        nav: 'nav',
        fileName: 'index.html'
    };
    config = _.assign(defaults, options);
    
    if( !config.template ) {
        throw new Error('[Scroll Rack] You have to specify a template path for navigation!');
    }

    
    // Conform metalsmith API
    return function ( files, metalsmith, done ) {
        var template = metalsmith.path(config.template),
            nav = metalsmith._metadata[config.nav];
        
        // Root has contents page?
        if( !files[config.fileName] ) {
            files[config.fileName] = {
                layout: template,
                title: 'Sections',
                sections: { nav: nav },
                contents: new Buffer('')
            };
        }
        
        // Sections have contents page?
        if( Object.keys(nav).length ) {
            _.forEach( nav, function ( section ) {
                if( !files[section.name + '/' + config.fileName] ) {
                    files[section.name + '/' + config.fileName] = {
                        layout: template,
                        title: _.capitalize(section.name),
                        sections: {
                            nav: [{ items: section.items }]
                        },
                        contents: new Buffer('')
                    };
                }
            });
        }
        
        done();
    }
}


module.exports = Sections;