'use strict';

var CORE = require("libcore"),
    COMPONENTS = require("./lib/component.js"),
    register = COMPONENTS.register,
    rehash = CORE.rehash,
    EXPORTS = {};
var DOM;

if (!global.libdom) {
    throw new Error("libdom package not found. Unable to load libdom-ui.");
}

DOM = require("libdom");

if (DOM.env.browser) {
    DOM.ui = EXPORTS;
    
    // try loading.. this will fail if not in webpack
    try {
        require("./styles/all.less");
    }
    catch (e) {}
    
    rehash(EXPORTS,
        require("./lib/event-bus.js"),
        {
            "createBus": "create",
            "bus": "bus"
        });
    
    
    rehash(EXPORTS,
        require("./lib/node.js"),
        {
            "bind": "bind"
        });
    
}

module.exports = EXPORTS['default'] = EXPORTS;
DOM.ui = EXPORTS;

/**
 * Register base components
 */

register("lib-dom", require("./lib/component/dom.js"));
register("lib-data", require("./lib/component/data.js"));
register("lib-template", require("./lib/component/template.js"));
