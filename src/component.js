'use strict';

var LIBCORE = require('libcore'),
    REGISTRY = LIBCORE.createRegistry();

function isComponent(Class) {
    var Base = Component;
    var proto;
    
    if (LIBCORE.method(Class)) {
        proto = Class.prototype;
        return proto.constructor === Class &&
                (Class === Base || proto instanceof Base);
    }
    return false;
}

function register(name, Class) {
    var core = LIBCORE;
    
    if (core.string(name) && isComponent(Class)) {
        REGISTRY.set(name = core.camelize(name), Class);
        Class.prototype.type = name;
        return name;
    }
    return null;
}

function get(name) {
    return REGISTRY.get(name);
}

function each(names, callback) {
    var camelize = LIBCORE.camelize,
        isString = LIBCORE.string,
        list = REGISTRY,
        args = Array.prototype.slice.call(arguments, 0);
    var c, l, name;
    
    for (c = -1, l = names.length; l--;) {
        name = names[++c];
        if (isString(name)) {
            name = camelize(name);
            if (list.exists(name)) {
                args[0] = name;
                args[1] = list.get(name);
                callback.apply(null, args);
            }
        }
    }
}

function Component() {
    
}


Component.prototype = {
    constructor: Component
};

register('structure', Component);

module.exports = {
    base: Component.prototype,
    is: isComponent,
    register: register,
    get: get,
    each: each
};
