'use strict';

var LIBCORE = require('libcore'),
    LIBDOM = require('libdom'),
    CONTEXT = require('./context.js'),
    DOM = require('./dom.js'),
    REGISTRY = LIBCORE.createRegistry(),
    DATA_ATTR_RE = /^data\-(.+)$/;

function register(name, callback) {
    var core = LIBCORE;
    
    if (!core.string(name)) {
        throw new Error('Invalid Reactor [name] parameter.');
    }
    
    if (!core.method(callback)) {
        throw new Error('Invalid Reactor [callback] parameter.');
    }
    
    REGISTRY.set(LIBCORE.camelize(name), callback);

}

function getReactors(dom) {
    var reactors = null,
        core = LIBCORE,
        camelize = core.camelize,
        registry = REGISTRY,
        dataRe = DATA_ATTR_RE;
    var c, l, name, orig, item, attr;
    
    if (LIBDOM.is(dom, 1)) {
        attr = dom.attributes;
        c = -1;
        l = attr.length;
    
    
        for (; l--;) {
            item = attr[++c];
            orig = item.name;
                        
            name = camelize(dataRe.test(orig) ?
                                orig.match(dataRe)[1] : orig);
            
            if (registry.exists(name)) {
                if (!reactors) {
                    reactors = {};
                }
                reactors[name] = registry.get(name);
            }
    
        }
        
    }
    
    return reactors;
}












function bindRoot(dom) {
    
    var D = DOM,
        context = D.link(dom, CONTEXT.root);
    
    // bind dom
    if (context) {
    
        // bind children
        D.children(dom, bindDescendant, [context]);
        
    }
    
    return context;
    
}

function bindDom(dom, context) {
    context = DOM.link(dom, context);
    
    return context;
}

function bindDescendant(dom, context) {
    
    var child = context.add();
    
    bindDom(dom, child);
    
    console.log('bind! ', dom, ' context: ', child);
    
    return true;
}



module.exports = {
    register: register,
    list: getReactors,
    bindRoot: bindRoot
};
