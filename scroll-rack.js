/// <reference path="typings/node/node.d.ts"/>

// Import
var callerId = require('caller-id'),
    path = require('path'),
    colors = require('colors'),

    // Metalsmith
    Metalsmith = require('metalsmith'),
    
    copy = require('./plugins/copy'),
    helpers = require('metalsmith-register-helpers'),
    layouts  = require('metalsmith-layouts'),
    partials = require('metalsmith-register-partials'),
    permalinks = require('metalsmith-permalinks'),
    prism = require('metalsmith-prism'),
    markdown   = require('metalsmith-markdown'),
    metadata = require('./plugins/metadata'),
    nav = require('./plugins/navigation'),
    sass = require('./plugins/sass'),
    sections = require('./plugins/sections'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch');


// Main
function ScrollRack ( config ) {
    var caller = callerId.getData(),
    
        filesPath = path.join(path.dirname(caller.filePath), config.files),
        destPath = path.join(path.dirname(caller.filePath), config.dest),
        
        ignoreFiles = config.ignore || ['*.js', '*.ts', '.DS_Store'],
        
        flags = [],
        metalsmith;

    
    // Parse command line arguments
    [].concat(process.argv, process.execArgv).forEach(function( arg ) {
        if( /^--/.test(arg) ) {
            flags.push(arg.replace(/^--/, ''));
        }
    });
    
    
    metalsmith = Metalsmith(__dirname)
        .source(filesPath)
        .destination(destPath)
        .ignore(ignoreFiles)
        .use(partials({
            directory: 'templates/partials'
        }))
        .use(helpers({
            directory: 'templates/helpers'
        }))
        
        .use(markdown())
        .use(permalinks({
            pattern: ':category/:title'
        }))
        
        .use(nav(config.nav))
        .use(sections({ 
            nav: config.nav.name || 'nav',
            template: 'templates/sections.hbs',
            redirect: config.redirect || true
        }))
        .use(metadata())
        .use(layouts({
            engine: 'handlebars',
            default: 'page.hbs',
            directory: 'templates'
        }))
        
        .use(copy({
            pattern: __dirname + '/assets/js/*.js',
            target: ''
        }))
        .use(sass({
            file: 'scss/style.scss',
            sourceMap: true,
            outputStyle: 'expanded'
        }));
    
    // Activate browser sync?
    if (~flags.indexOf('serve')) {
       metalsmith
           .use(serve({
               verbose: true
           }))
           .use(watch({
               paths: {
                   "${source}/**/*": true,
                   "templates/**/*": "**/*",
                   "assets/js/*": "**/*"
               },
               livereload: true
           }));
    }

    metalsmith
        .build(function(err) {
            if (err) { throw err; }
            console.log('[scroll-rack] '.grey + 'Build complete!'.green.bold);
        });
}


module.exports = ScrollRack;