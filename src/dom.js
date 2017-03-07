'use strict';

var libdom = require('libdom'),
    CONTEXT = require('./context.js');



function bind(context, dom, bindChildren) {
    var current;
    
    if (CONTEXT.is(context) && libdom.is(dom, 1)) {
        
    }
}

function eachChildren(dom, callback, args) {
    var depth, current, node;
    
    if (libdom.is(dom, 1)) {
        depth = 1;
        args = args || [];
        
        for (current = dom.firstChild; depth && current;) {
            node = null;
            
            // go deeper
            if (callback.apply(current, args) !== true ||
                current.nodeType === 1) {
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
        
        
    }
    
    node = current = null;
    
}


module.exports = {
    children: eachChildren
};