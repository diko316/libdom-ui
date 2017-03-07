'use strict';

var LIBDOM = require("libdom");
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


function Empty() {
    
}

function Context(parent) {
    if (parent) {
        this.parent = parent;
        this.vm = createVm(parent);
    }
}

Context.prototype = {
    parent: null,
    first: null,
    last: null,
    previous: null,
    next: null,
    dom: null,
    vm: {},
    
    constructor: Context,
    
    bind: function (dom) {
        if (LIBDOM.is(dom, 1)) {
            this.unbind();
            
            this.dom = dom;
        }
        
        return this;
    },
    
    unbind: function () {
        var dom = this.dom;
        
        if (dom) {
            
            
            
        }
        
        dom = null;
        delete this.dom;
        
        return this;
    },
    
    add: function (before) {
        var me = this,
            instance = new Context(me),
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
                instance.after = after;
                after.before = instance;
            }
            
            // before
            before.after = instance;
            instance.before = before;
            
            // unset last
            if (last === before) {
                last = instance;
            }
            
        }
        
        // reconnect parent
        me.first = first || instance;
        me.last = last || instance;
        
        return instance;
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
            
        }
        
        return null;
    }
    
    
    
};

// create root
ROOT = new Context();
Context.prototype.root = ROOT;


module.exports = {
    is: isContext,
    root: ROOT
};