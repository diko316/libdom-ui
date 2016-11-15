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
        id = element.getAttribute(NODE_ATTRIBUTE);
        if (id && BINDS.exists(id)) {
            return INFO_BOUND;
        }
        
        return COMPONENT.roles(element) ?
                    INFO_CAN_BIND : INFO_ELEMENT;

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
    // assign node
    component.node = node;
    component[methodName] = boundToEvent;
    
    LIBDOM.on(node.dom, event, boundToEvent, component);
}

function unbindComponentListenerCallback(event, methodName, method, component) {
    /* jshint validthis:true */
    var node = this;
    LIBDOM.un(node.dom, event, method, component);
    delete component.node;
}


function publishCallback(element) {
    /* jshint validthis:true */
    var params = this,
        node = getNodeFromElement(element);
    
    // dispatch
    if (node) {
        node.dispatch(params[0], params[1]);
    }
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
    
    // initialize component at this point
    me.dispatch('cmp-ready');
}

Node.prototype = {
    
    id: NULL,
    components: NULL,
    dom: NULL,
    store: NULL,
    destroyed: true,
    
    constructor: Node,
    
    parent: function () {
        var me = this,
            isBound = INFO_BOUND,
            node = me.dom;
        
        if (node && !me.destroyed) {
            for (; node; node = node.parentNode) {
                if (bindInfo(node) === isBound) {
                    return node;
                }
            }
        }
        return null;
    },
    
    root: function () {
        var me = this,
            isBound = INFO_BOUND,
            node = me.dom,
            found = null;
            
        if (node && !me.destroyed) {
            node = node.parentNode;
            for (; node; node = node.parentNode) {
                if (bindInfo(node) === isBound) {
                    found = node;
                }
            }
            node = null;
        }
        return found;
    },
    
    publish: function (type, data) {
        var me = this,
            root = me.root(),
            CORE = LIBCORE;
        var dom;
        
        if (root && !root.destroyed) {
            dom = root.dom;
            if (dom && CORE.string(type)) {
                if (!CORE.object(data)) {
                    data = {};
                }
                // no bubbling allowed
                data.bubbles = false;
                LIBDOM.eachNodePreorder(dom,
                                        publishCallback,
                                        [type, data]);
            }
            dom = null;
        }
        return me;
    },
    
    dispatch: function (type, data) {
        var me = this,
            dom = me.dom,
            CORE = LIBCORE;
        if (!me.destroyed && dom) {
            if (CORE.string(type)) {
                if (!CORE.object(data)) {
                    data = {};
                }
                return LIBDOM.dispatch(dom, type, data);
            }
        }
        return null;
    },
    
    destroy: function () {
        var me = this,
            unbind = unbindComponentListenerCallback,
            dom = me.dom,
            eachListener = EVENT.eachListener;
        var total, l, list, component;
        
        if (!me.destroyed) {

            // destroy components
            this.dispatch('destroy', { bubbles: false });
            
            delete me.destroyed;
            
            list = me.components;
            for (total = l = list.length; l--;) {
                component = list[l];
                eachListener(component, unbind, me);
            }
            
            list.splice(0, total);
            
        }
        dom = list = null;
    }
};


module.exports = {
    bind: bindNode,
    bindChildren: bindChildren
};