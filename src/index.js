'use strict';

var LIBDOM = require("libdom");
var REACTOR;

// from here it is now safe to load browser modules
if (LIBDOM.info.browser) {
    
    
    REACTOR = require("./reactor.js");
    
    
    //REACTOR.bindRoot(global.document.documentElement);
    
}

