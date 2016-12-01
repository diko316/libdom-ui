'use strict';


var LIBCORE = require("libcore"),
    BASE = require("./base.js");

function getAttribute(dom, name) {
    switch (name) {
    case "for":
        return dom.htmlFor;
    case "class":
    case "className":
        return dom.className;
    case "css":
    case "style":
        return dom.style.cssText;
    }
    return dom.getAttribute(name);
}

function setAttribute(dom, name, value) {
    switch (name) {
    case "for":
        dom.htmlFor = value;
        break;
    case "class":
    case "className":
        dom.className = value;
        break;
    case "css":
    case "style":
        dom.style.cssText = value;
        break;
    }
    console.log('get attribute', name, dom.getAttribute(name));
    return dom.getAttribute(name);
}


function Dom() {
    
}

Dom.prototype = LIBCORE.instantiate(BASE, {
    constructor: Dom,
    
    dom: function () {
        var node = this.node;
        return node ? node.dom : null;
    },
    
    attribute: function (name, value) {
        var me = this,
            CORE = LIBCORE,
            isString = CORE.string,
            dom = me.dom(),
            valid = dom && isString(name);

        // setter
        if (arguments.length > 1) {
            if (CORE.number(value)) {
                value = value.toString();
            }
            if (valid && isString(value)) {
                setAttribute(dom, name, value);
            }
            dom = me;
        
        // getter
        }
        else {
            
            dom = valid ? getAttribute(dom, name) : '';
            
        }
        
        return dom;
    }
    
});

module.exports = Dom;