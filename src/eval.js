'use strict';

var LIBCORE = require("libcore"),
    IDENTIFIER_RE = /^[a-zA-Z\$\_][a-zA-Z\$\_0-9]*$/,
    TOKEN = require("./eval/token.json");

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
    
    var len = expr.length,
        token = tokenize(expr, 0, len),
        stackValue = null,
        sl = 0,
        pl = 0,
        stack = [],
        parseTree = [];
    var id, str;
    
    console.log('expr: ', expr);
    // parse
    for (; token;) {
        //console.log('token ', token);
        id = token[0];
        str = token[1];
        
        switch (id) {
        case ' ': break; // ignore whitespace
        
        // operands
        case 'integer':
        case 'float':
        case 'string':
        case 'identifier':
            parseTree[pl++] = [id, str];
            break;
        
        // operator precedence
        case '-':
        case '+':
            
            break;
        
        default:
            console.log('uncaught ', token);
        }

        token = tokenize(expr, token[2], len);

    }
    
    
    
}

function tokenize(expr, from, len) {
    var l = Math.max(len - from, 0),
        c = from,
        next = from + 1,
        map = TOKEN.state,
        ends = TOKEN.token,
        state = 'start',
        current = map.start,
        token = null,
        proceed = true;
    var chr, catchAll, contains, not, notChr, buffered;
    
    if (from === l) {
        return ["$", "", l + 1];
    }

    for (; l--;) {
       
        chr = expr.charAt(c++);
        notChr = '!' + chr;
        catchAll = current.catchAll;
        contains = chr in current;
        not = notChr in current;
        
        // dont buffer
        if (not || (!contains && !catchAll)) {
            buffered = false;
            proceed = false;
        }
        else {
            state = contains ?
                        current[chr] : catchAll;
            current = map[state];
            buffered = true;
        }
        
        if (state in ends) {
            token = ends[state];
            next = buffered ? c : c - 1;
        }
        
        if (!proceed) {
            break;
        }
        
    }
    
    return token && [token, expr.substring(from, next), next];
}






module.exports = {
    interpolate: interpolate
};