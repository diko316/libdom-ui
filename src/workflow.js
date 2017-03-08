'use strict';

var CONTEXT = require('./context.js'),
    COMPONENT = require('./component.js'),
    DOM = require('./dom.js');


function bind(dom, context) {
    var components = getRoleComponents(dom);
    
    // bind if there's component
    if (components) {
        context.bind(dom, components);
        console.log('binding ', dom, ' and ', context, components);
    }
    
}

function getRoleComponents(dom) {
    var get = COMPONENT.get,
        roles = DOM.getRoles(dom),
        c = -1,
        l = roles.length,
        found = [],
        fl = 0;
    var role;
    
    for (; l--;) {
        role = get(roles[++c]);
        if (role) {
            found[fl++] = role;
        }
    }
    
    return found.length ? found : null;
}

function start() {
    var dom = global.document.documentElement;
    
    DOM.setRoles(dom, 'application');
    
    bind(dom, CONTEXT.root);
    
    dom = null;

}


module.exports = {
    bind: bind,
    start: start
};