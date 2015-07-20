// Import
var callerId = require('caller-id'),
    path = require('path'),
    open = require('open'),
    chalk = require('chalk'),

    log = require('./helpers/log'),
    escape = require('./helpers/escape'),
    renderPermalink = require('./helpers/renderPermalink'),
    theme = require('./helpers/theme'),

    // Metalsmith
    Metalsmith = require('metalsmith'),

    copy = require('./plugins/copy'),
    helpers = require('metalsmith-register-helpers'),
    hyphenate = require('metalsmith-hyphenate'),
    layouts  = require('metalsmith-layouts'),
    partials = require('metalsmith-register-partials'),
    permalinks = require('metalsmith-permalinks'),
    markdown   = require('metalsmith-markdownit'),
    metadata = require('./plugins/metadata'),
    nav = require('./plugins/navigation'),
    normalizeAssetPath = require('./plugins/normalizeAssetPath'),
    rebuild = require('./plugins/rebuild'),
    sass = require('./plugins/sass'),
    sections = require('./plugins/sections'),
    serve = require('metalsmith-serve');


// Main
function ScrollRack ( config ) {
    var caller = callerId.getData(),

        rootPath = path.dirname(caller.filePath),
        sourcePath = path.join(rootPath, config.files),
        destPath = path.join(rootPath, config.dest),
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
        typographer: true,
        linkify: true,
        breaks: true,
        langPrefix: 'hljs ',
        highlight: escape
    });
    md.parser
        .use(require('markdown-it-footnote'))
        .use(require('markdown-it-smartarrows'))
        .use(require('markdown-it-anchor'), {
            level: 2,
            permalink: true,
            renderPermalink: renderPermalink
        });


    // Build
    metalsmith = Metalsmith(__dirname)
        .source(sourcePath)
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
        .use(normalizeAssetPath())

        .use(nav(config.nav))
        .use(sections({
            nav: 'nav',
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
        .use(hyphenate({
            elements: ['p', 'blockquote']
        }))
        .use(sass({
            file: 'scss/style.scss',
            sourceMap: true,
            outputStyle: 'expanded'
        }));

    // Copy files
    metalsmith
        .use(copy(
            [{
                pattern: __dirname + '/assets/js/*.js',
                target: ''
            }, {
                pattern: theme(config.code_theme),
                target: '',
                rename: 'theme.css'
            }, {
                pattern: __dirname + '/assets/favicon.ico',
                target: ''
            }].concat(
                // Conditionally set assets
                config.assets ? [{
                    pattern: path.join(rootPath, config.assets, '/**/*'),
                    target:  'assets'
                }] : []
            )
        ));


    // Activate browser sync?
    if (~flags.indexOf('serve')) {
        metalsmith
            .use(serve({
                port: config.port || 8080
            }))
            .use(rebuild({
                pattern: [
                    path.join(sourcePath + '/**/*'),
                    path.join(__dirname + '/scroll-rack.js'),
                    path.join(__dirname + '/plugins/**/*'),
                    path.join(__dirname + '/templates/**/*'),
                    path.join(__dirname + '/scss/**/*.scss'),
                    path.join(__dirname + '/assets/**/*')
                ],
                livereload: true
            }));
    }

    metalsmith
        .build(function(err) {
            if (err) { throw err; }
            log(chalk.green.bold('Build complete!'));
            if (~flags.indexOf('serve')) {
                open('http://localhost:'+ (config.port || 8080) + '/');
            }
        });
}


module.exports = ScrollRack;