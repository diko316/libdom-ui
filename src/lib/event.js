'use strict';

var LIBCORE = require("libcore"),
    LISTENER_RE = /^on([a-zA-Z].*)$/;

function methodToEventName(name) {
    var match = name.match(LISTENER_RE);
    var raw;
    
    if (match) {
        raw = match[1];
        return LIBCORE.uncamelize(raw.charAt(0).toLowerCase() +
                                    raw.substring(1, raw.length));
    }
    return null;
}

function eventNameToMethod(name) {
    return LIBCORE.camelize(name.charAt(0).toUpperCase() +
                            name.substring(1, name.length));
}

function eachListener(instance, callback, scope) {
    var param = [callback, scope];
    
    LIBCORE.each(instance, eachListenerCallback, param, false);
    
}

function eachListenerCallback(value, name, instance) {
    /* jshint validthis:true */
    var param = this,
        eventName = methodToEventName(name);
        
    if (eventName && LIBCORE.method(value)) {
        return param[0].call(param[1], eventName, name, value, instance);
    }
    return true;
}

function bindMethod(instance, name) {
    var original = instance[name];
    
    function boundToEvent() {
        return original.apply(instance, arguments);
    }
    instance[name] = boundToEvent;
    
}

module.exports = {
    bind: bindMethod,
    eachListener: eachListener,
    method2name: methodToEventName,
    name2method: eventNameToMethod
};