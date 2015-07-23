var _ = require('lodash'),
    chalk = require('chalk'),
    log = require('./../helpers/log'),
    fs = require('fs'),
    Handlebars = require('handlebars'),
    redirect = require('metalsmith-redirect');


function Sections ( options ) {
    var defaults,
        config;

    defaults = {
        nav: 'nav',
        fileName: 'index.html',
        redirect: false
    };
    config = _.assign(defaults, options);

    if( !config.template ) {
        log(chalk.red('You have to specify a template path for navigation!'));
        return;
    }


    // Conform metalsmith API
    return function ( files, metalsmith, done ) {
        var template = metalsmith.path(config.template),
            nav = metalsmith._metadata[config.nav];

        // Root has contents page?
        if( !files[config.fileName] ) {
            files[config.fileName] = {
                layout: template,
                title: 'Table of Contents',
                sections: { nav: nav },
                contents: new Buffer('')
            };
        }

        // Sections have contents page?
        if( Object.keys(nav.groups).length && !config.redirect ) {
            _.forEach( nav.groups, function ( section ) {
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

        // Build redirects
        if( config.redirect ) {
            var redirect_config = {};
            _.forEach( nav.groups, function ( section ) {
               if( !files['/' + section.name + '/.index.html'] ) {
                   redirect_config['/' + section.name] = '/' + section.items[0].path;
               }
            });
            redirect(redirect_config)(files, metalsmith, function () {});
        }

        done();
    }
}


module.exports = Sections;