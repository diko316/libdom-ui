'use strict';

var LIBCORE = require("libcore"),
    STREAM_PIPE = /|(?!|)/g;

function interpolate(expr) {
    var core = LIBCORE,
        Fn = Function,
        body = '';
        
    if (core.string(expr)) {
        
        body = ([
            'try {',
                transpile(expr),
            '} catch (e) {',
                'console.warn(e);',
            '}'
        ]).join('\n');

    }
    
}

function transpile(expr) {
    
    
    
    
    
    
}






module.exports = {
    interpolate: interpolate
};