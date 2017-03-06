'use strict';

var LIBCORE = require('libcore'),
    REGISTRY = LIBCORE.createRegistry();

function register(name, callback) {
    var core = LIBCORE;
    
    if (!core.string(name)) {
        throw new Error('Invalid Reactor [name] parameter.');
    }
    
    if (!core.method(callback)) {
        throw new Error('Invalid Reactor [callback] parameter.');
    }
    
    
    
    
    
}

module.exports = {
    register: register
};
