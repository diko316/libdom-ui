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
        bind: bind,
        destroy: destroy
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
    
    case STAT_BINDED:
        return true;
    
    default:
        return false;
    }
}


function bindDescendants(element, parent, includeCurrent) {
    var depth = 0,
        dom = element,
        localBind = bind;
    var current;
    
    if (includeCurrent === true) {
        localBind(dom);
    }
    
    dom = dom.firstChild;
    
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


function destroy(element) {
    if (stat(element) === STAT_BINDED) {
        LIBDOM.dispatch(element, 'node-destroy', { bubbles: false });
        return true;
    }
    return false;
}

function eachChildren(element, callback, arg1, arg2, arg3, arg4, arg5) {
    var depth = 0,
        dom = element,
        bindedStat = STAT_BINDED,
        getStat = stat;
    var current;
    
    dom = dom.firstChild;
    
    for (current = dom; current;) {
        
        // go down 1 level if not binded or not skipped (return false)
        if (getStat(current) !== bindedStat ||
            callback(current, arg1, arg2, arg3, arg4, arg5) === false) {
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


function destroyChildren(element) {
    
    eachChildren(element, destroy);
    
}

function onListenComponentListener(event, methodName, method, component) {
    /* jshint validthis:true */
    var node = this;
    
    function boundToEvent(event) {
        
        decorateEvent(node, event);
        
        return method.call(component, event, node, []);

    }
    
    // assign node
    component[methodName] = boundToEvent;
    node.listened[event] = true;
    
    LIBDOM.on(node.dom, event, boundToEvent, component);

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
    var G = global,
        component = COMPONENT,
        rootRole = ROOT_ROLE,
        root = G.document.documentElement;
        
    // cleanup
    LIBDOM.un(G.window, 'load', kickstart);
    G = null;
    
    // register!
    if (!component.registered(rootRole)) {
        component.register(rootRole, require("./component/app-root.js"));
    }
    
    // add main role
    switch (stat(root)) {
    case STAT_ELEMENT:
        // add main role
        root.setAttribute('role', rootRole);
        
    /* falls through */
    case STAT_CAN_BIND:
        bind(root, null);
    }
    
}

function asyncAfterNodeEvent(node, event, promise) {
    var P = Promise;
    function onAfterNodeEvent() {
        if (!node.destroyed) {
            node.onAfterEvent(event);
        }
        return event;
    }
    function onReject(e) {
        onAfterNodeEvent();
        return P.reject(e);
    }
    
    return (promise || Promise.resolve(event)).
                then(onAfterNodeEvent, onReject);
}

function decorateEvent(node, event) {
    if (!LIBCORE.method(event.until)) {
        event.until = untilResolved(node);
    }
}

function untilResolved(node) {
    
    function resolveOrNot() {
        var currentNode = node,
            events = --currentNode.runningTasks;

        // call node.onAfterProcess
        if (!events && !currentNode.destroyed) {
            currentNode.onAfterProcesses();
        }
        currentNode = null;
    }
    
    function runTask(data) {
        var CORE = LIBCORE,
            P = Promise,
            currentNode = node;
        var running;

        if (!currentNode.destroyed) {
            
            running = currentNode.runningTasks++;
            
            if (!running) {
                currentNode.onBeforeProcesses();
            }
            currentNode = null;
    
            (CORE.method(data) ? new P(data) : P.resolve(data)).
                then(resolveOrNot, resolveOrNot);
        }
    }
    return runTask;
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
    me.data = {};
    me.listened = {};
    
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
        item = components[++c];
        item.node = me;
        each(item, listen, me);
    }
    
    item = null;
    
    // listen to node destroy event
    LIBDOM.on(dom, 'node-destroy', me.destroy, me);
    
    // bind descendants
    initializeAndBindNodeDescendants(me);
}

Node.prototype = {
    dom: null,
    runningTasks: 0,
    stateChangeEvent: 'state-change',
    parentStateChangeEvent: 'parent-state-change',
    pendingEvents: 0,
    parent: null,
    firstChild: null,
    lastChild: null,
    previousSibling: null,
    nextSibing: null,
    data: null,
    cache: null,
    destroyed: true,
    
    constructor: Node,

    component: function (name) {
        var me = this,
            components = me.components;
        var l, component;
        
        if (components && !me.destroyed) {
            
            for (l = components.length; l--;) {
                component = components[l];
                if (component.name === name) {
                    return component;
                }
            }
        }
        
        return null;
    
    },
    
    
    onBeforeProcesses: function () {
        var me = this;
        
        if (!me.destroyed) {
            me.cache = LIBCORE.clone(me.data, true);
            
        }
    },
    
    onAfterProcesses: function () {
        var me = this,
            data = me.data,
            cache = me.cache;
            
        console.log('state change! ', !LIBCORE.compare(data, cache), data, cache);
        
        if (!me.destroyed && !LIBCORE.compare(data, cache)) {
            me.dispatch(me.stateChangeEvent, {
                    bubbles: false,
                    data: data,
                    cached: cache
                });
        }
        me.cache = cache = data = null;
    },
    
    onBeforeEvent: function (event) {
        var me = this;

        if (!me.destroyed && event.type !== me.stateChangeEvent &&
            0 === me.pendingEvents++) {
            
            // save current data for later comparison
            //      in detecting state change
            me.cache = LIBCORE.clone(me.data, true);
            
        }
        
    },
    
    onAfterEvent: function (event) {
        var me = this,
            data = me.data,
            cache = me.cache,
            stateChangeEvent = me.stateChangeEvent,
            parentStateChangeEvent = me.parentStateChangeEvent;
        var node, message;
        
        // check if there are changes in state data
        if (!me.destroyed && event.type !== stateChangeEvent &&
            0 === --me.pendingEvents && !LIBCORE.compare(data, cache)) {

            delete me.cache;
            message = {
                    bubbles: false,
                    data: data,
                    cached: cache
                };
            me.dispatch(stateChangeEvent, message);
            // notify children
            for (node = me.firstChild; node; node = node.nextSibling) {
                me.dispatch(parentStateChangeEvent, message);
            }
            
            cache = null;
        }
    },
    
    dispatch: function (event, message) {
        var me = this,
            CORE = LIBCORE,
            P = Promise,
            async = asyncAfterNodeEvent;
        var promises, listened, promise;
        
        if (CORE.string(event)) {
            listened = CORE.contains(me.listened, event);
            message = CORE.object(message) ?
                            CORE.assign({}, message) : {};
            
            message.promises = promises = [];
            message.isNodeEvent = true;
            
            event = LIBDOM.dispatch(me.dom, event, message);
            
            message.promises = null;
            
            if (promises.length) {
                promise = P.all(promises).
                            then(function () {
                                promises.splice(0, promises.length);
                                event.promises = promises = null;
                                return event;
                            });
            }
            else {
                event.promises = promises = null;
                promise = P.resolve(event);
            }
            
            return listened ? async(me, event, promise) : promise;
        
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
    
    destroyChildren: function () {
        var me = this,
            dom = me.dom;
            
        if (dom) {
            destroyChildren(dom);
        }
        dom = null;
        return me;
    },
    
    destroy: function () {
        var me = this,
            libdom = LIBDOM,
            each = EVENT.eachListener,
            unlisten = onUnlistenComponentListener;
        var components, l, parent, previous, next, dom;
        
        if (!me.destroyed) {
            delete me.destroyed;
            
            dom = me.dom;
            if (dom) {
                libdom.un(dom, 'node-destroy', me.destroy, me);
            }
            
            // destroy descendants
            me.destroyChildren();
            
            // call destroy
            if (dom) {
                libdom.dispatch(me.dom, 'destroy', { bubbles: false });
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
                delete me.parent;
            }
            
            console.log('destroyed! ', dom);
            // clear!
            LIBCORE.clear(me);
            me.dom = dom = null;
            console.log((new Error('destroyed')).stack);
        }
        
        
        return me;
    }
};

module.exports = EXPORTS;

// register app-root component
LIBDOM.on(global.window, 'load', kickstart);




