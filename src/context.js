'use strict';

var LIBDOM = require("libdom"),
    LIBCORE = require("libcore"),
    CONTEXTS = [];
var ROOT;


function isContext(node) {
    return node instanceof Context;
}

function isChild(parent, node) {
    return isContext(node) && node.parent !== parent;
}

function createVm(parent) {
    var instance;
    
    Empty.prototype = parent.vm;
    instance = new Empty();
    
    return instance;
}

function getContext(id) {
    var list = CONTEXTS;
    id = parseInt(id, 10);
    
    return LIBCORE.number(id) && id in list ? list[id] : null;
}


function Empty() {
    
}

function Context(parent) {
    var list = CONTEXTS,
        id = list.length;
        
    this.index = id;
    list[id] = this;
    
    if (parent) {
        this.parent = parent;
        this.vm = createVm(parent);
    }
}

Context.prototype = {
    index: -1,
    parent: null,
    first: null,
    last: null,
    previous: null,
    next: null,
    dom: null,
    vm: {},
    
    constructor: Context,
    
    add: function (before) {
        var me = this,
            child = new Context(me),
            first = me.first,
            last = me.last;
        var after;
        
        if (!isChild(me, before)) {
            before = last;
        }

        // reconnect sibling
        if (before) {
            // after
            after = before.after;
            if (after) {
                child.after = after;
                after.before = child;
            }
            
            // before
            before.after = child;
            child.before = before;
            
            // unset last
            if (last === before) {
                last = child;
            }
            
        }
        
        // reconnect parent
        me.first = first || child;
        me.last = last || child;
        
        return child;
    },
    
    remove: function (child) {
        var me = this;
        var first, last, previous, next;
        
        if (isChild(me, child)) {
            
            // sibling
            previous = child.previous;
            next = child.next;
            
            if (previous) {
                previous.next = next;
            }
            if (next) {
                next.previous = previous;
            }
            
            // child
            first = me.first;
            last = me.last;
            
            if (first === child) {
                me.first = previous || next;
            }
            
            if (last === child) {
                me.last = next || previous;
            }
            
            // unset!
            delete child.previous;
            delete child.next;
            delete child.parent;
            
            return child;
            
        }
        
        return null;
    }
    
    
    
};

// create root
ROOT = new Context();
Context.prototype.root = ROOT;


module.exports = {
    is: isContext,
    root: ROOT,
    get: getContext
};