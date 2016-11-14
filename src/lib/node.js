'use strict';

var LIBDOM = require("libdom"),
    LIBCORE = require("libcore"),
    COMPONENT = require("./component.js"),
    Store = require("./store.js"),
    NODE_ATTRIBUTE = "data-ui-node",
    NODE_ID_GEN = 0,
    NULL = null,
    DOM_EVENT_NAME = 'libdom-ui-event',
    BINDS = LIBCORE.createRegistry();

function getNodeFromElement(element) {
    var list = BINDS;
    var id;

    id = element.getAttribute(NODE_ATTRIBUTE);
    if (list.exists(id)) {
        return list.get(id);
    }
    
    return null;
}

function canBind(element) {
    return LIBDOM.is(element, 1) &&
            !!COMPONENT.roles(element);
}

function bindNode(element, includeChildren) {
    var node;

    if (canBind(element)) {
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

function bindMethod(instance, name) {
    var original = instance[name];
    
    function boundToInstance() {
        return original.apply(instance, arguments);
    }
    
    instance[name] = boundToInstance;
    return boundToInstance;
}

function Node(element) {
    var me = this,
        DOM = LIBDOM,
        component = COMPONENT,
        create = component.create,
        bind = bindMethod,
        id = 'node' + (++NODE_ID_GEN),
        names = COMPONENT.roles(element),
        dispatchName = DOM_EVENT_NAME,
        instances = [],
        except = {},
        c = -1,
        l = names.length;
    
    me.destroyed = false;
    me.id = id;
    me.dom = element;
    me.store = new Store();
    element.setAttribute(NODE_ATTRIBUTE, id);
    BINDS.set(id, me);
    
    // instantiate components
    for (; l--;) {
        create(names[++c], instances, except);
    }
    
    me.components = instances;
    
    // bind methods
    bind(me, 'onEvent');
    
    // listen to events
    DOM.on(element, dispatchName, me.onEvent);
    
    DOM.dispatch(element,
                dispatchName, {
                    eventMessage: {
                        type: "attach",
                        data: null
                    }
                });

}

Node.prototype = {
    
    id: NULL,
    components: NULL,
    dom: NULL,
    store: NULL,
    destroyed: true,
    
    constructor: Node,
    
    onEvent: function (event) {
        var me = this,
            CORE = LIBCORE,
            message = event.eventMessage;
        
        if (CORE.object(message)) {
            
            me.each(message.type, me, event.data);
            
            console.log('message! ', message);
        }
        
    },
    
    each: function (methodName) {
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
    
    publish: function () {
        
    },
    
    dispatch: function () {
        
    },
    
    listen: function () {
        
    },
    
    destroy: function () {
        var me = this;
        var total, l, list;
        
        if (!me.destroyed) {
            delete me.destroyed;
            LIBDOM.un(me.dom, 'libdom-ui-event', me.onEvent);
            
            // destroy components
            list = me.components;
            
            for (total = l = list.length; l--;) {
                list[l].destroy();
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