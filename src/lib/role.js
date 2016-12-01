'use strict';


var LIBCORE = require("libcore"),
    Base = require("./role/base-class.js"),
    ROLE_REGISTRY = LIBCORE.createRegistry(),
    ROLE_NAMES_SPLIT_RE = /[ \s\t\n]+/,
    EXPORTS = {
        Base: Base,
        has: hasRole,
        register: register
    };



function hasRole(roles) {
    var CORE = LIBCORE,
        registry = ROLE_REGISTRY;
    var role, l;
    
    if (CORE.string(roles)) {
        roles = roles.split(ROLE_NAMES_SPLIT_RE);
        for (l = roles; l--;) {
            role = roles[l];
            if (role && registry.exists(role)) {
                return true;
            }
        }
    }
    return false;
}

function register(name, options) {
    var CORE = LIBCORE,
        isString = CORE.string,
        Class = null;
    var len;
    
    if (!isString(name)) {
        throw new Error("Invalid [name] parameter. Unable to register Role.");
    }
    
    if (!CORE.array(options)) {
        options = Array.prototype.slice.call(arguments, 0);
    }
    
    len = options.length;
    if (!len || !CORE.method(Class = options[len - 1])) {
        throw new Error(
            "Role Registry requires Role Class. Unable to register Role.");
    }
    
    // filter options
    for (; len--;) {
        if (!isString(options[len])) {
            options.splice(len, 1);
        }
    }
    
    ROLE_REGISTRY.set(name, {
        ensured: false,
        requires: options,
        Class: Class
    });
    
}


function instantiate(role, node) {
    
}




ROLE_REGISTRY.set('libdom-base-role', {
    ensured: true,
    requires: [],
    Class: Base
});

module.exports = EXPORTS;