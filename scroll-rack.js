/// <reference path="typings/node/node.d.ts"/>

// Import
var callerId = require('caller-id'),
    path = require('path'),
    colors = require('colors'),
    open = require('open'),
    
    escape = require('./plugins/escape'),

    // Metalsmith
    Metalsmith = require('metalsmith'),
    
    copy = require('./plugins/copy'),
    helpers = require('metalsmith-register-helpers'),
    layouts  = require('metalsmith-layouts'),
    partials = require('metalsmith-register-partials'),
    permalinks = require('metalsmith-permalinks'),
    prism = require('metalsmith-prism'),
    markdown   = require('metalsmith-markdownit'),
    metadata = require('./plugins/metadata'),
    nav = require('./plugins/navigation'),
    sass = require('./plugins/sass'),
    sections = require('./plugins/sections'),
    serve = require('metalsmith-serve'),
    theme = require('./plugins/theme'),
    watch = require('metalsmith-watch');


// Main
function ScrollRack ( config ) {
    var caller = callerId.getData(),
    
        filesPath = path.join(path.dirname(caller.filePath), config.files),
        destPath = path.join(path.dirname(caller.filePath), config.dest),
        
        ignoreFiles = config.ignore || ['*.js', '*.ts', '.DS_Store'],
        
        flags = [],
        md,
        metalsmith;

    
    // Parse command line arguments
    [].concat(process.argv, process.execArgv).forEach(function( arg ) {
        if( /^--/.test(arg) ) {
            flags.push(arg.replace(/^--/, ''));
        }
    });
    
    
    // Configure markdown
    md = markdown({ 
        breaks: true,
        langPrefix: 'hljs ',
        highlight: escape
    });
    
    
    // Build
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
        
        .use(md)
        .use(permalinks({
            pattern: ':category/:title'
        }))
        
        .use(nav(config.nav))
        .use(sections({ 
            nav: config.nav.name || 'nav',
            template: 'templates/sections.hbs',
            redirect: config.redirect || true
        }))
        .use(metadata({
            flags: flags
        }))
        .use(layouts({
            engine: 'handlebars',
            default: 'page.hbs',
            directory: 'templates'
        }))
        
        .use(copy([
            {
                pattern: __dirname + '/assets/js/*.js',
                target: ''
            }, {
                pattern: theme(config.code_theme),
                target: '',
                rename: 'theme.css'
            }
        ]))
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
                   '${source}/**/*': true,
                   'scroll-rack.js': '**/*',
                   'plugins/**/*': '**/*',
                   'templates/**/*': '**/*',
                   'scss/**/*.scss': '**/*',
                   'assets/js/*': '**/*'
               },
               livereload: true
           }));
    }

    metalsmith
        .build(function(err) {
            if (err) { throw err; }
            console.log('[scroll-rack] '.grey + 'Build complete!'.green.bold);
            if (~flags.indexOf('serve')) {
                open('http://localhost:'+ (config.port || 8080) + '/');
            }
        });
}


module.exports = ScrollRack;