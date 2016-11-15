'use strict';

var LIBDOM = require("libdom"),
    LIBCORE = require("libcore"),
    COMPONENT = require("./component.js"),
    EVENT = require("./event.js"),
    Store = require("./store.js"),
    INFO_INVALID = 0,
    INFO_BOUND = 1,
    INFO_CAN_BIND = 2,
    INFO_ELEMENT = 3,
    
    NODE_ATTRIBUTE = "data-ui-node",
    NODE_ID_GEN = 0,
    NULL = null,
    BINDS = LIBCORE.createRegistry();


/**
 * Node bindings
 */
function getNodeFromElement(element) {
    var list = BINDS;
    var id;

    id = element.getAttribute(NODE_ATTRIBUTE);
    if (list.exists(id)) {
        return list.get(id);
    }
    
    return null;
}

function bindInfo(element) {
    var id;
    if (LIBDOM.is(element, 1)) {
        if (COMPONENT.roles(element)) {
            id = element.getAttribute(NODE_ATTRIBUTE);
            if (id && BINDS.exists(id)) {
                return INFO_BOUND;
            }
            return INFO_CAN_BIND;
        }
        return INFO_ELEMENT;
    }
    return INFO_INVALID;
}

function bindNode(element, includeChildren) {
    var node;

    if (bindInfo(element) === INFO_CAN_BIND) {
        node = getNodeFromElement(element);
        if (!node) {
            node = new Node(element);
        }
    }
    
    if (includeChildren === true) {
        bindChildren(element);
    }

    return node;
}

function bindChildren(element) {
    var DOM = LIBDOM,
        each = DOM.eachNodePreorder,
        bind = bindNode;
    var child;
    
    if (DOM.is(element, 1)) {
        for (child = element.firstChild; child; child = child.nextSibling) {
            if (child.nodeType === 1) {
                each(child, bind);
            }
        }
    }
    child = null;
}

/**
 * Node Events
 */
function bindComponentListenerCallback(event, methodName, method, component) {
    /* jshint validthis:true */
    var node = this;
    
    function boundToEvent(event) {
        return method.call(this, event, node);
    }
    component[methodName] = boundToEvent;
    LIBDOM.on(node.dom, event, boundToEvent, component);
}

function unbindComponentListenerCallback(event, methodName, method, component) {
    /* jshint validthis:true */
    var node = this;
    LIBDOM.un(node.dom, event, method, component);
}


/**
 * Node Class
 */

function Node(element) {
    var me = this,
        component = COMPONENT,
        create = component.create,
        id = 'node' + (++NODE_ID_GEN),
        names = component.roles(element),
        eachListener = EVENT.eachListener,
        bind = bindComponentListenerCallback,
        instances = [],
        except = {};
        
        
    var c, l;
    
    me.destroyed = false;
    me.id = id;
    me.dom = element;
    me.store = new Store();
    element.setAttribute(NODE_ATTRIBUTE, id);
    BINDS.set(id, me);
    
    // instantiate components
    for (c = -1, l = names.length; l--;) {
        create(names[++c], instances, except);
    }
    
    me.components = instances;
    
    // apply component listener
    for (c = -1, l = instances.length; l--;) {
        eachListener(instances[++c], bind, me);
    }

}

Node.prototype = {
    
    id: NULL,
    components: NULL,
    dom: NULL,
    store: NULL,
    destroyed: true,
    
    constructor: Node,
    
    onEvent: function (event) {
        var CORE = LIBCORE,
            message = event.eventMessage;
        
        if (CORE.object(message)) {
            
            //me.callEach(message.type, me, event.data);
            
            //console.log('message! ', message);
        }
        
    },
    
    callEach: function (methodName) {
        var args = Array.prototype.slice.call(arguments, 0),
            isMethod = LIBCORE.method,
            list = this.components,
            c = -1,
            l = list.length;
        var method, component;
        
        for (; l--;) {
            component = list[++c];
            if (methodName in component &&
                isMethod(method = component[methodName])) {
                try {
                    method.apply(component, args);
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    },
    
    getParent: function () {
        var node = this.dom;
        for (; node; node = node.parentNode) {
            if (bindInfo(node) === INFO_BOUND) {
                return node;
            }
        }
        return null;
    },
    
    publish: function () {
        
    },
    
    dispatch: function () {
        
    },
    
    listen: function () {
        
    },
    
    destroy: function () {
        var me = this,
            unbind = unbindComponentListenerCallback,
            eachListener = EVENT.eachListener;
        var total, l, list, component;
        
        if (!me.destroyed) {
            delete me.destroyed;
            LIBDOM.un(me.dom, 'libdom-ui-event', me.onEvent);
            
            // destroy components
            list = me.components;
            
            for (total = l = list.length; l--;) {
                list[l].destroy();
                eachListener(component, unbind, me);
            }
            
            list.splice(0, total);
            list = null;
        }
    }
};


module.exports = {
    bind: bindNode,
    bindChildren: bindChildren
};