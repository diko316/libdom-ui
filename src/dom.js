'use strict';

var LIBDOM = require('libdom'),
    LIBCORE = require('libcore'),
    ATTRIBUTE_NAME = 'data-libvm',
    DATA_ATTR_RE = /^data\-(.+)$/,
    ROLE_ATTR_RE = /[ \r\n\t\s]+/,
    TRIM_RE = /^\s+|\s+$/g;


//function getContext(dom) {
//    return LIBDOM.is(dom, 1) ?
//                CONTEXT.get(dom.getAttribute(ATTRIBUTE_NAME)) : null;
//}
//
//function link(dom, context) {
//    var old;
//    
//    if (LIBDOM.is(dom, 1) && CONTEXT.is(context)) {
//        old = getContext(dom);
//        
//        if (context !== old) {
//            // unlink first
//            if (old) {
//                unlink(dom);
//            }
//            context.dom = dom;
//            dom.setAttribute(ATTRIBUTE_NAME, context.index);
//            
//        }
//        
//        return context;
//    }
//    return null;
//}
//
//function unlink(dom) {
//    var context = getContext(dom);
//    
//    if (context) {
//        
//        delete context.dom;
//        dom.removeAttribute(ATTRIBUTE_NAME);
//        return context;
//    
//    }
//    
//    return null;
//}
//
//
//function attributes(dom) {
//    var attr = dom.attributes,
//        camelize = LIBCORE.camelize,
//        dataRe = DATA_ATTR_RE,
//        c = -1,
//        l = attr.length,
//        values = {},
//        names = [],
//        camels = [],
//        reference = {};
//    var item, orig, name, camels;
//    
//    for (; l--;) {
//        item = attr[++c];
//        names[c] = orig = item.name;
//                    
//        name = camelize(dataRe.test(orig) ?
//                            orig.match(dataRe)[1] : orig);
//        
//        reference[orig] = camels[c] = name;
//        
//        values[name] = item.value;
//
//    }
//    
//    
//}



function getRoles(dom, camelized) {
    var roles = dom.getAttribute('role'),
        core = LIBCORE,
        apply = camelized !== false ?
                    core.camelize : core.uncamelize;
    var l;
    
    if (roles) {
        roles = roles.replace(TRIM_RE, '').split(ROLE_ATTR_RE);
        l = roles.length;
        if (l) {
            for (; l--;) {
                roles[l] = apply(roles[l]);
            }
            return roles;
        }
    }
    
    return [];
}

function setRoles(dom, newRoles) {
    var core = LIBCORE,
        uncamelize = core.uncamelize,
        camelize = core.camelize,
        isString = core.string,
        applied = [];
    var role, roles, total, c, l, al;
    
    if (isString(newRoles)) {
        newRoles = Array.prototype.slice.call(arguments, 0);
    }
    
    if (core.array(newRoles)) {
        roles = getRoles(dom, false);
        total = roles.length;
        al = 0;
        for (c = -1, l = newRoles.length; l--;) {
            role = newRoles[++c];
            if (isString(role)) {
                role = uncamelize(camelize(role));
                if (roles.indexOf(role) !== -1) {
                    roles[total++] = applied[al++] = role;
                }
            }
        }
        
        dom.setAttribute('role', roles.join(' '));
    }

    return applied;
    
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
    //context: getContext,
    //link: link,
    //unlink: unlink,
    //attributes: attributes,
    getRoles: getRoles,
    setRoles: setRoles,
    children: eachChildren
};