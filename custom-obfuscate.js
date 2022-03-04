var JavaScriptObfuscator = require('rollup-obfuscator');

process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});