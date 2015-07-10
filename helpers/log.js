var chalk = require('chalk');

function log ( string ) {
    var PREFIX = chalk.gray('[scroll-rack] ');
    console.log(PREFIX + string);
}

module.exports = log;