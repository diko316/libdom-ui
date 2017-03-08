'use strict';

var LIBDOM = require("libdom");
var WORKFLOW;

// from here it is now safe to load browser modules
if (LIBDOM.info.browser) {
    
    
    WORKFLOW = require("./workflow.js");
    
    WORKFLOW.start();
    
    
    
}

