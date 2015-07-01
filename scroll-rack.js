/// <reference path="typings/node/node.d.ts"/>

// Import
var callerId = require('caller-id'),
    path = require('path'),
    colors = require('colors'),

    // Metalsmith
    Metalsmith = require('metalsmith'),
    
    browserSync = require('metalsmith-browser-sync'),
    markdown   = require('metalsmith-markdown'),
    nav = require('./src/navigation'),
    templates  = require('metalsmith-templates');


// Main
function ScrollRack ( config ) {
    var caller = callerId.getData(),
    
        filesPath = path.join(path.dirname(caller.filePath), config.files),
        destPath = path.join(path.dirname(caller.filePath), config.dest),
        
        ignoreFiles = config.ignore || ['*.js', '*.ts'],
        
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
        
        .use(markdown())
        .use(templates({
            engine: 'handlebars',
            default: 'page.hbt'
         }))
        .use(nav(config.nav));
    
    // Activate browser sync?
    if (~flags.indexOf('serve')) {
       metalsmith.use(browserSync({
           server: destPath,
           files: [filesPath]
       }));
    }

    metalsmith
        .build(function(err) {
        if (err) { throw err; }
            console.log('===', 'Build complete!'.rainbow.bold, '===');
        });
}

module.exports = ScrollRack;