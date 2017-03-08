'use strict';

var LIBCORE = require('libcore'),
    REGISTRY = LIBCORE.createRegistry;

function isComponent(Class) {
    var Base = Component;
    var proto;
    
    if (LIBCORE.method(Class)) {
        proto = Class.prottoype;
        return proto.constructor === Class &&
                (Class === Base || proto instanceof Base);
    }
    return false;
}

function register(name, Class) {
    var core = LIBCORE;
    
    if (core.string(name) && isComponent(Class)) {
        REGISTRY.set(name = core.camelize(name), Class);
        return name;
    }
    return null;
}

function get(name) {
    return REGISTRY.get(name);
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
    get: get
};
