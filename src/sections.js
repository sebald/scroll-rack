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
        var template = fs.readFileSync( metalsmith.path(config.template), 'utf8'),
            render = Handlebars.compile(template),
            nav = metalsmith._metadata[config.nav];
        
        // Root has contents page?
        if( !files[config.fileName] ) {
            files[config.fileName] = {
                title: 'Sections',
                contents: new Buffer(render({ 
                    title: 'Sections',
                    nav: nav,
                    sections: { nav: nav }
                }), 'utf-8')
            };
        }
        
        // Sections have contents page?
        if( Object.keys(nav).length ) {
            _.forEach( nav, function ( section ) {
                if( !files[section.name + '/' + config.fileName] ) {
                    files[section.name + '/' + config.fileName] = {
                        title: _.capitalize(section.name),
                        contents: new Buffer(render({
                            title: _.capitalize(section.name),
                            nav: nav,
                            sections: {
                                nav: [{ items: section.items }]
                            } 
                        }), 'utf-8')
                    };
                }
            });
        }
        
        done();
    }
}


module.exports = Sections;