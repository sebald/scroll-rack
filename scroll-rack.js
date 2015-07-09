/// <reference path="typings/node/node.d.ts"/>

// Import
var callerId = require('caller-id'),
    path = require('path'),
    colors = require('colors'),

    // Metalsmith
    Metalsmith = require('metalsmith'),
    
    browserSync = require('metalsmith-browser-sync'),
    copy = require('./src/copy'),
    helpers = require('metalsmith-register-helpers'),
    layouts  = require('metalsmith-layouts'),
    partials = require('metalsmith-register-partials'),
    permalinks = require('metalsmith-permalinks'),
    prism = require('metalsmith-prism'),
    markdown   = require('metalsmith-markdown'),
    metadata = require('./src/metadata'),
    nav = require('./src/navigation'),
    sass = require('./src/sass'),
    sections = require('./src/sections');


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
        
        .use(sass({
            file: 'scss/style.scss',
            sourceMap: true,
            outputStyle: 'expanded'
        }))
        .use(copy({
            pattern: __dirname + '/assets/js/*.js',
            target: ''
        }));
    
    // Activate browser sync?
    if (~flags.indexOf('serve')) {
       metalsmith.use(browserSync({
           server: destPath,
           files: [
               __dirname + '/templates/**/*.hbs', 
               __dirname + '/templates/helpers/**/*.js',
               __dirname + '/scss/**/*.scss',
               filesPath + '**/*.md'
           ],
           reloadDelay: 500
       }));
    }

    metalsmith
        .build(function(err) {
            if (err) { throw err; }
            console.log('[scroll-rack] Build complete!'.green.bold);
        });
}


module.exports = ScrollRack;