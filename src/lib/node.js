'use strict';

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    MIDDLEWARE = LIBCORE.middleware("libdom-ui.node"),
    NODE_BIND_ATTR = 'data-node-bind',
    NODE_ROLES_ATTR = 'role',
    NODE_ID_GEN = 0,
    ZOMBIES = [],
    NODES = {},
    EXPORTS = {
        bind: bindFrom,
        unbind: unbindFrom
    };
/**
 * Node Status
 */
function canBind(node) {
    
    // cannot bind if node already has binds
    if (getBinding(node)) {
        return false;
    }
    
    // role attribute must be a non-empty string
    return !!node.getAttribute(NODE_ROLES_ATTR);
}

/**
 * Node Management
 */
function bindFrom(node) {
    var DOM = LIBDOM;
    
    if (DOM.is(node, 1, 9)) {
        DOM.eachNodePreorder(node.nodeType === 9 ?
                                node.body :
                                node,
                            bind);
    }
    return EXPORTS;
}

function bind(node) {
    var zombies = ZOMBIES,
        nodes = NODES;
    var nodeBind;
    
    if (canBind(node)) {
        
        // try resurrecting zombies
        if (zombies.length) {
            nodeBind = nodes[zombies[0]];
            nodeBind.dead = false;
            zombies.splice(0, 1);
        }
        // should create one
        else {
            nodeBind = new Node();
        }
        nodeBind.bind(node);
        
        return nodeBind.id;
    
    }
    return void(0);
}

function getBinding(node) {
    var CORE = LIBCORE,
        nodes = NODES,
        id = node.getAttribute(NODE_BIND_ATTR);
        
    if (CORE.string(id) && id in nodes) {
        return nodes[id];
    }
    return false;
}

function unbindFrom(node) {
    var DOM = LIBDOM;
    
    if (DOM.is(node, 1, 9)) {
        DOM.eachNodePostorder(node.nodeType === 9 ?
                                node.body :
                                node,
                            unbind);
    }
    
    return EXPORTS;
}

function unbind(node) {
    var binding = getBinding(node);
    
    // destroy binds
    if (binding) {
        binding.destroy();
    }
}

/**
 * Node Life Cycle
 */


function destroy(id) {
    
}

/**
 * Node Class
 */
function Node() {
    var me = this,
        id = 'node' + (++NODE_ID_GEN);
    
    me.id = id;
    me.dead = false;
    NODES[id] = me;
    MIDDLEWARE.run("create", [me]);
}

Node.prototype = {
    dom: null,
    dead: true,
    attached: false,
    
    constructor: Node,

    bind: function (node) {
        var me = this,
            run = MIDDLEWARE.run;
        var args;
        if (!me.dom) {
            args = [me, node];
            run("before:bind", args);
            me.dom = node;
            me.onBind(node);
            run("after:bind", args);
            args = args[0] = args[1] = null;
        }
        
        return me;
    },
    
    onBind: function () {
        
    },
    
    unbind: function () {
        var me = this,
            run = MIDDLEWARE.run,
            dom = me.dom;
        var args;
        
        if (dom) {
            args = [me, dom];
            run("before:unbind", args);
            me.onUnbind(dom);
            me.dom = null;
            run("after:unbind", args);
            dom = args = args[0] = args[1] = null;
        }
        
        return this;
    },
    
    onUnbind: function () {
        
    },
    
    destroy: function () {
        var me = this,
            zombies = ZOMBIES,
            run = MIDDLEWARE.run,
            id = me.id;
        var args;
        
        if (!me.dead) {
            // stop all concurrent destroy calls
            me.dead = true;
            
            // unbind if it has dom
            if (me.dom) {
                me.unbind();
            }
            
            // destroy proper
            args = [me];
            run("before:destroy", args);
            args = args[0] = null;
            me.onDestroy();
            LIBCORE.clear(me);
            
            // restore id (this should be permanent)
            me.id = id;
            run("after:destroy", args);
            
            // turn to zombie
            zombies[zombies.length] = id;
            
        }
    },
    
    onDestroy: function () {
        
    }
};


module.exports = EXPORTS;




