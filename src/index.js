'use strict';

var LIBDOM = require("libdom");
var WORKFLOW, COMPONENT;

// from here it is now safe to load browser modules
if (LIBDOM.info.browser) {
    //WORKFLOW = require("./workflow.js");
    //
    //// register components
    //COMPONENT = require("./component.js");
    //
    //COMPONENT.register('application',
    //                   require("./component/application.js"));
    
    
    
    var ev = require("./eval.js");
    ev.interpolate("buang()");
    
    //WORKFLOW.start();
    
    
    
}

