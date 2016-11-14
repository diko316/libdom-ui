'use strict';

var LIBCORE = require("libcore"),
    NUMERIC_RE = /^([1-9][0-9]*|0)$/;


function eachPath(path, callback, arg1, arg2, arg3, arg4) {
    var escape = "\\",
        dot = ".",
        buffer = [],
        bl = 0;
    var c, l, chr, apply, last;
    
    for (c = -1, l = path.length; l--;) {
        chr = path.charAt(++c);
        apply = false;
        last = !l;
        switch (chr) {
        case escape:
            chr = "";
            if (l) {
                chr = path.charAt(++c);
                l--;
            }
            break;
        case dot:
            chr = "";
            apply = true;
            break;
        }
        
        if (chr) {
            buffer[bl++] = chr;
        }
        
        if (last || apply) {
            if (bl) {
                if (callback(buffer.join(""),
                            last,
                            arg1,
                            arg2,
                            arg3,
                            arg4) === false) {
                    return;
                }
                buffer.length = bl = 0;
            }
        }
    }
}

function isAccessible(subject, item) {
    var CORE = LIBCORE;
    switch (true) {
    case CORE.object(subject):
    case CORE.array(subject) &&
        (!NUMERIC_RE.test(item) || item !== 'length'):
        
        if (!CORE.contains(subject, item)) {
            return false;
        }
    }
    return true;
}

function findCallback(item, last, operation) {
    var subject = operation[1];
    
    if (!isAccessible(subject, item)) {
        operation[0] = void(0);
        return false;
    }
    
    operation[last ? 0 : 1] = subject[item];
    return true;
}


function find(path, object) {
    var operation = [void(0), object];
    eachPath(path, findCallback, operation);
    operation[1] = null;
    return operation[0];
}

function clone(path, object, deep) {
    return LIBCORE.clone(find(path, object), deep);
}


function getItemsCallback(item, last, operation) {
    operation[operation.length] = item;
}

function assign(path, subject, value, overwrite) {
    var CORE = LIBCORE,
        has = CORE.contains,
        array = CORE.array,
        object = CORE.object,
        apply = CORE.assign,
        parent = subject,
        numericRe = NUMERIC_RE;
    var items, c, l, item, name, numeric, property, isArray, temp;
    
    if (CORE.object(parent) || CORE.array(parent)) {
        eachPath(path, getItemsCallback, items = []);
        
        if (items.length) {
            name = items[0];
            items.splice(0, 1);
            
            for (c = -1, l = items.length; l--;) {
                item = items[++c];
                numeric = numericRe.test(item);
                
                // finalize
                if (has(parent, name)) {
                    property = parent[name];
                    isArray = array(property);
                    
                    // replace property into object or array
                    if (!isArray && !object(property)) {
                        if (numeric) {
                            property = [property];
                        }
                        else {
                            temp = property;
                            property = {};
                            property[""] = temp;
                        }
                    }
                    // change property to object to support "named" property
                    else if (isArray && !numeric) {
                        property = apply({}, property);
                        delete property.length;
                    }
                    
                }
                else {
                    property = numeric ? [] : {};
                }
                
                parent = parent[name] = property;
                name = item;
                
            }
            
            if (overwrite !== true && has(parent, name)) {
                property = parent[name];
                
                // append
                if (array(property)) {
                    parent = property;
                    name = parent.length;
                }
                else {
                    parent = parent[name] = [property];
                    name = 1;
                }
            }
            
            parent[name] = value;
    
            parent = value = property = temp = null;
            
            return true;
        
        }
        
        
    }
    return false;
}


function removeCallback(item, last, operation) {
    var subject = operation[0];
    var isLength;
    
    if (!isAccessible(subject, item)) {
        return false;
    }
    
    // set
    if (last) {
        if (LIBCORE.array(subject)) {
            isLength = item === 'length';
            subject.splice(isLength ?
                                0 : item.toString(10),
                            isLength ?
                                subject.length : 1);
        }
        else {
            delete subject[item];
        }
        
        operation[1] = true;
    }
    else {
        operation[0] = subject[item];
    }
    
}

function remove(path, object) {
    var operation = [object, false];
    eachPath(path, removeCallback, operation);
    operation[0] = null;
    return operation[1];
}


module.exports = {
    find: find,
    compare: LIBCORE.compare,
    clone: clone,
    each: eachPath,
    assign: assign,
    remove: remove
};