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

function getContext(id) {
    var list = CONTEXTS;
    id = parseInt(id, 10);
    
    return LIBCORE.number(id) && id in list ? list[id] : null;
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
    var list = CONTEXTS,
        id = list.length;
        
    this.index = id;
    list[id] = this;
    
    this.components = [];
    this.instances = {};
    
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
    mounted: null,
    components: null,
    instances: null,
    vm: {},
    
    constructor: Context,
    
    bind: function (dom, components) {
        var list = this.components,
            instances = this.instances,
            vm = this.vm;
        var c, l, name, Class;
        
        this.unbind();
        
        this.dom = dom;

        // bind components
        for (c = -1, l = components.length; l--;) {
            Class = components[++c];
            name = Class.prototype.type;
            list[c] = name;
            vm[name] = instances[name] = new Class(vm);
            
        }
        
        return this;
    },
    
    unbind: function () {
        var dom = this.dom,
            components = this.components,
            instances = this.instances,
            vm = this.vm;
        var c, l, name, component;
        
        if (dom) {
            this.call('unmount');
            
            // destroy component
            this.call('destroy');
            
            // unset vm and instances
            for (c = -1, l = components.length; l--;) {
                name = components[++c];
                component = instances[name];
                
                if (name in vm && vm[name] === component) {
                    delete vm[name];
                }
                
                delete instances[name];
            }
            
            components.splice(0, components.length);
            
        }
        
        this.dom = dom = null;
        
        return this;
    },
    
    mount: function () {
        
    },
    
    unmount: function () {
        
    },
    
    call: function (action) {
        var components = this.components,
            instances = this.instances,
            isFunction = LIBCORE.method,
            c = -1,
            l = components.length,
            eventObject = {
                vm: this.vm,
                returnValue: void(0)
            };
        var component, args, method;
        
        if (LIBCORE.string(action)) {
            args = Array.prototype.slice.call(arguments, 0);
            args[0] = eventObject;
            for (; l--;) {
                component = instances[components[++c].prototype.type];
                if (action in component &&
                    isFunction(method = component[action])) {
                    try {
                        method.apply(component, args);
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
            }
        }
        
        return eventObject.returnValue;
        
    },
    
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