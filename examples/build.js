var ScrollRack = require('../scroll-rack.js');

ScrollRack({
    files: './docs',
    dest: './../__build',

    assets: './assets',

    nav: {
        order: ['typescript', 'angular']
    }
});