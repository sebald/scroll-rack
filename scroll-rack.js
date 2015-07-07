/// <reference path="typings/node/node.d.ts"/>

// Import
var callerId = require('caller-id'),
    path = require('path'),
    colors = require('colors'),

    // Metalsmith
    Metalsmith = require('metalsmith'),
    
    browserSync = require('metalsmith-browser-sync'),
    sections = require('./src/sections'),
    layouts  = require('metalsmith-layouts'),
    partials = require('metalsmith-register-partials'),
    permalinks = require('metalsmith-permalinks'),
    prism = require('metalsmith-prism'),
    markdown   = require('metalsmith-markdown'),
    metadata = require('./src/metadata'),
    nav = require('./src/navigation'),
    sass = require('./src/sass');


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
        
        .use(markdown())
        .use(permalinks({
            pattern: ':category/:title'
        }))
        
        .use(nav(config.nav))
        .use(sections({ 
            nav: config.nav.name || 'nav',
            template: 'templates/sections.hbt'
        }))
        .use(metadata())
        .use(layouts({
            engine: 'handlebars',
            default: 'page.hbt',
            directory: 'templates'
        }))
        .use(function ( files ) {
                console.log(files);
            }
        )
        
        .use(sass({
            file: 'scss/style.scss',
            sourceMap: true,
            outputStyle: 'expanded'
        }));
    
    // Activate browser sync?
    if (~flags.indexOf('serve')) {
       metalsmith.use(browserSync({
           server: destPath,
           files: [filesPath, '!'+destPath]
       }));
    }

    metalsmith
        .build(function(err) {
        if (err) { throw err; }
            console.log('===', 'Build complete!'.rainbow.bold, '===');
        });
}


module.exports = ScrollRack;