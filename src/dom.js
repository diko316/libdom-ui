'use strict';

var LIBDOM = require('libdom'),
    LIBCORE = require('libcore'),
    CONTEXT = require("./context.js"),
    ATTRIBUTE_NAME = 'data-libvm',
    DATA_ATTR_RE = /^data\-(.+)$/;


function getContext(dom) {
    return LIBDOM.is(dom, 1) ?
                CONTEXT.get(dom.getAttribute(ATTRIBUTE_NAME)) : null;
}

function link(dom, context) {
    var old;
    
    if (LIBDOM.is(dom, 1) && CONTEXT.is(context)) {
        old = getContext(dom);
        
        if (context !== old) {
            // unlink first
            if (old) {
                unlink(dom);
            }
            context.dom = dom;
            dom.setAttribute(ATTRIBUTE_NAME, context.index);
            
        }
        
        return context;
    }
    return null;
}

function unlink(dom) {
    var context = getContext(dom);
    
    if (context) {
        
        delete context.dom;
        dom.removeAttribute(ATTRIBUTE_NAME);
        return context;
    
    }
    
    return null;
}


function attributes(dom) {
    var attr = dom.attributes,
        camelize = LIBCORE.camelize,
        dataRe = DATA_ATTR_RE,
        c = -1,
        l = attr.length,
        values = {},
        names = [],
        camels = [],
        reference = {};
    var item, orig, name, camels;
    
    for (; l--;) {
        item = attr[++c];
        names[c] = orig = item.name;
                    
        name = camelize(dataRe.test(orig) ?
                            orig.match(dataRe)[1] : orig);
        
        reference[orig] = camels[c] = name;
        
        values[name] = item.value;

    }
    
    
}








function eachChildren(dom, callback, args) {
    var depth, current, node;
    
    if (LIBDOM.is(dom, 1)) {
        depth = 1;
        
        if (!LIBCORE.array(args)) {
            args = [null];
        }
        else {
            args = [null].concat(args);
        }
        
        for (current = dom.firstChild; depth && current;) {
            node = null;
            args[0] = current;
            
            // go deeper if callback returns non-true value
            if (current.nodeType === 1 &&
                callback.apply(current, args) !== true) {
                node = current.firstChild;
                if (node) {
                    depth++;
                }
            }
            
            if (!node) {
                
                node = current.nextSibling;
                
                for (; !node && depth-- && current;) {
                    current = current.parentNode;
                    
                    node = current.nextSibling;
                }
            }
            
            current = node;
            
        }
        
        args[0] = null;
        
    }
    
    node = current = null;
    
}


module.exports = {
    context: getContext,
    link: link,
    unlink: unlink,
    attributes: attributes,
    children: eachChildren
};