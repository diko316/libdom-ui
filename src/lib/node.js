'use strict';

var LIBDOM = require("libdom"),
    LIBCORE = require("libcore"),
    COMPONENT = require("./component.js"),
    NODE_ATTRIBUTE = "data-ui-node",
    NODE_ID_GEN = 0,
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

function Node(element) {
    var me = this,
        component = COMPONENT,
        create = component.create,
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

}

Node.prototype = {
    id: null,
    destroyed: true,
    constructor: Node,
    destroy: function () {
        
    }
};


module.exports = {
    bind: bindNode,
    bindChildren: bindChildren
};