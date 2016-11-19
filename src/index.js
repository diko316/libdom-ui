'use strict';

var DOM = require("libdom"),
    CORE = require("libcore"),
    COMPONENTS = require("./lib/component.js"),
    register = COMPONENTS.register,
    rehash = CORE.rehash,
    EXPORTS = {};

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


/**
 * Register base components
 */

register("lib-dom", require("./lib/component/dom.js"));
register("lib-template", require("./lib/component/template.js"));