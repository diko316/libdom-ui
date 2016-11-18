'use strict';

var LIBCORE = require('libcore'),
    LIBDOM = require('libdom'),
    EVENT = require("./event.js"),
    COMPONENT = require('./component.js'),
    ROLE_ATTRIBUTE = 'role',
    ROOT_ROLE = 'app-root',
    REGISTERED_NODE_ATTRIBUTE = 'data-ui-node',
    NODE_STATE_RE = /^(uninitialized|interactive|detached)$/,
    STAT_INVALID_DOM = 0,
    STAT_CAN_BIND = 1,
    STAT_BINDED = 2,
    STAT_ELEMENT = 3,
    EXPORTS = {
        bind: bind
    };
    
function empty() {
    
}

function stat(dom) {
    var type = dom.nodeType,
        isString = LIBCORE.string;
    var roles, state;
    
    if (type === 1) {
        
        state = dom.getAttribute(REGISTERED_NODE_ATTRIBUTE);
        if (isString(state) && NODE_STATE_RE.test(state)) {
            return STAT_BINDED;
        }
        
        roles = dom.getAttribute(ROLE_ATTRIBUTE);
        if (isString(roles)) {
            roles = COMPONENT.validRoles(roles);
            if (roles) {
                return STAT_CAN_BIND;
            }
        }
        
        return STAT_ELEMENT;
    }
    
    return STAT_INVALID_DOM;
}

function bind(dom, parent) {
    var Class = Node;
    var node;
    
    switch (stat(dom)) {
    case STAT_CAN_BIND:
        if (parent) {
            empty.prototype = parent;
            node = new empty();
            Class.call(node, dom, parent);
        }
        else {
            node = new Class(dom, parent);
        }
        return node;
    case STAT_BINDED: return true;
    default: return false;
    }
}


function bindDescendants(element, parent, includeCurrent) {
    var depth = 0,
        dom = element,
        localBind = bind;
    var current;
    
    if (includeCurrent !== false) {
        localBind(dom);
    }
    
    
    for (current = dom; current;) {
        // go down 1 level
        if (!localBind(dom, parent)) {
            dom = current.firstChild;
            if (dom) {
                depth++;
                current = dom;
                continue;
            }
        }
        
        // try next sibling or go up check next parent's next sibling
        dom = current.nextSibling;
        for (; !dom && depth-- && current;) {
            current = current.parentNode;
            dom = current.nextSibling;
        }

        current = dom;
    }
    
    dom = current = null;
    
}

function onListenComponentListener(event, methodName, method, component) {
    /* jshint validthis:true */
    var node = this;
    
    function boundToEvent(event) {
        var promises = event.promises;

        if (!LIBCORE.array(promises)) {
            promises = [];
        }
        return method.call(component, event, node, promises);
    }
    
    // assign node
    component.node = node;
    component[methodName] = boundToEvent;
    
    LIBDOM.on(node.dom, event, boundToEvent, component);
    node = null;
}

function onUnlistenComponentListener(event, methodName, method, component) {
    /* jshint validthis:true */
    var node = this;
    LIBDOM.un(node.dom, event, method, component);
    node = null;
}

function initializeAndBindNodeDescendants(node) {
    node.dispatch("initialize").
        then(function () {
            var current = node;
            current.bindChildren();
            if (!current.destroyed) {
                current.dom.setAttribute(REGISTERED_NODE_ATTRIBUTE,
                                        'interactive');
            }
            current = null;
        });
}

function kickstart() {
    var root = global.document.documentElement;
    console.log('kick start!');
    // add main role
    switch (stat(root)) {
    case STAT_ELEMENT:
        // add main role
        root.setAttribute('role', ROOT_ROLE);
        
    /* falls through */
    case STAT_CAN_BIND:
        bind(root, null);
    }
}

function Node(dom, parent) {
    var me = this,
        component = COMPONENT,
        create = component.create,
        names = component.roles(dom),
        each = EVENT.eachListener,
        listen = onListenComponentListener,
        components = [],
        except = {};
    var c, l, item;
    
    me.destroyed = false;
    me.dom = dom;
    
    // create dom-like properties
    if (parent) {
        me.parent = parent;
        item = parent.lastChild;
        if (item) {
            item.nextSibling = me;
            me.previousSibling = item;
        }
        else {
            parent.firstChild = me;
        }
        parent.lastChild = me;
    }
    
    me.components = components;
    
    // set flag as bound
    dom.setAttribute(REGISTERED_NODE_ATTRIBUTE, 'uninitialized');
    
    // bind components
    for (c = -1, l = names.length; l--;) {
        create(names[++c], components, except);
    }
    // listen
    for (c = -1, l = components.length; l--;) {
        each(components[++c], listen, me);
    }
    
    // bind descendants
    initializeAndBindNodeDescendants(me);
}

Node.prototype = {
    dom: null,
    parent: null,
    firstChild: null,
    lastChild: null,
    previousSibling: null,
    nextSibing: null,
    destroyed: true,
    constructor: Node,
    dispatch: function (event, message) {
        var me = this,
            CORE = LIBCORE,
            P = Promise;
        var promises;
        
        if (CORE.string(event)) {
            message = CORE.object(message) ?
                            CORE.assign({}, message) : {};

            message.promises = promises = [];
            
            event = LIBDOM.dispatch(me.dom, event, message);
            
            message.promises = null;
            
            if (promises.length) {
                return P.all(promises).
                            then(function () {
                                promises.splice(0, promises.length);
                                event.promises = promises = null;
                                return event;
                            });
            }
            event.promises = promises = null;
            return P.resolve(event);
        
        }
        
        return P.reject("Invalid [event] parameter.");
    },
    
    bindChildren: function () {
        var me = this,
            dom = me.dom;
        if (!me.destroyed) {
            bindDescendants(dom, me, false);
        }
        dom = null;
        return me;
    },
    
    
    destroy: function () {
        var me = this,
            each = EVENT.eachListener,
            unlisten = onUnlistenComponentListener;
        var components, l, parent, previous, next, node;
        
        if (!me.destroyed) {
            delete me.destroyed;
            
            // call destroy
            LIBDOM.dispatch(me.dom, 'destroy', { bubbles: false });
            
            // destroy child nodes
            for (node = me.firstChild; node; node = node.nextSibling) {
                node.destroy();
            }
            
            // unlisten
            components = me.components;
            if (components) {
                for (l = components.length; l--;) {
                    each(components[l], unlisten, me);
                }
                components.length = 0;
            }
            delete me.components;
            
            parent = me.parent;
            
            if (parent) {
                // remove sibling relation
                previous = me.previousSibling;
                next = me.nextSibling;
                if (previous) {
                    previous.nextSibling = next;
                }
                if (next) {
                    next.previousSibling = previous;
                }
                // remove parent relationship
                if (parent.firstChild === me) {
                    parent.firstChild = previous || next;
                }
                if (parent.lastChild === me) {
                    parent.lastChild = next || previous;
                }
            }
            
            // clear!
            LIBCORE.clear(me);
        }
        
        return me;
    }
};

module.exports = EXPORTS;

// register app-root component
COMPONENT.register(ROOT_ROLE, require("./component/app-root.js"));
LIBDOM.on(global.window, 'load', kickstart);




