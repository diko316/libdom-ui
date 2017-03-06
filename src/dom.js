'use strict';

var libdom = require('libdom'),
    CONTEXT = require('./context.js');



function compile(context, dom) {
    if (CONTEXT.is(context) && libdom.is(dom, 1)) {
        
    }
}


module.exports = {
    compile: compile
};