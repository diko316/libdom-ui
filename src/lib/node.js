'use strict';

var LIBDOM = require("libdom"),
    LIBCORE = require("libcore"),
    COMPONENT = require("./component.js"),
    NODE_ATTRIBUTE = "data-ui-node",
    NODE_ID_GEN = 0,
    NULL = null,
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
    function boundToInstance() {
        return instance[name].apply(instance, arguments);
    }
    instance[name] = boundToInstance;
    return boundToInstance;
}

function Node(element) {
    var me = this,
        component = COMPONENT,
        create = component.create,
        bind = bindMethod,
        id = 'node' + (++NODE_ID_GEN),
        names = COMPONENT.roles(element),
        instances = [],
        except = {},
        c = -1,
        l = names.length;
    
    me.destroyed = false;
    me.id = id;
    me.dom = element;
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
    LIBDOM.on(element, 'libdom-ui-event', me.onEvent);
    
    console.log("ok! ", me);
}

Node.prototype = {
    
    id: NULL,
    components: NULL,
    dom: NULL,
    destroyed: true,
    
    constructor: Node,
    
    onEvent: function (event) {
        console.log('event on ', this.dom, ' event: ', event);
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