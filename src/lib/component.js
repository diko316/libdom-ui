'use strict';

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    COMPONENT_TYPE_ATTR = 'role',
    COMPONENT_ID_ATTR = 'data-id',
    COMPONENT_ID_GEN = 0,
    DEFAULT_TYPE = 'presentation',
    COMPONENT_TYPES = {},
    COMPONENTS = {},
    MIDDLEWARE_PREFIX = 'libdom-ui.component.',
    ZOMBIES = [],
    EXPORTS = {};

/**
 * middlewares
 */
function runMiddleware(before, name, args) {
    return LIBCORE.run(
                (before === true ? 'before:' : 'after:') +
                MIDDLEWARE_PREFIX + name,
                args || []
            );
}

function registerMiddleware(before, name, handler) {
    return LIBCORE.register(
                (before === true ? 'before:' : 'after:') +
                MIDDLEWARE_PREFIX + name,
                handler);
}

/**
 * Component life cycle
 */
function bind(component, node) {
    var run = runMiddleware,
        args = [component, node];
    
    run(true, 'bind', args);
    component.onBind(node);
    run(false, 'bind', args);
    args = args[0] = args[1] = null;
    return component;
}

function beforeBind(component, node) {
    component.dom = node;
}

function afterBind(component) {
    // apply attach
    if (component.detached) {
        attach(component);
    }
}

function attach(component) {
    var node = component.dom,
        run = runMiddleware;
    var args;
    
    if (node && component.detached &&
        LIBDOM.contains(node.ownerDocument, node)) {

        args = [component, node];
        run(true, 'attach', args);
        component.detached = false;
        component.onAttach();
        run(false, 'attach', args);
        args = args[0] = args[1] = null;
        
    }
    node = null;
    return component;
}


function detach(component) {
    var node = component.dom,
        run = runMiddleware;
    var args;
        
    if (node && !component.detached &&
        !LIBDOM.contains(node.ownerDocument, node)) {
        args = [component, node];
        run(true, 'detach', args);
        component.detached = true;
        component.onDetach();
        run(false, 'detach', args);
        args = args[0] = args[1] = null;
    }
    node = null;
    return component;
}

function unbind(component) {
    var run = runMiddleware,
        node = component.dom;
    var args;
    
    if (node) {
        args = [component];
        run(true, 'unbind', args);
        component.dom = null;
        run(false, 'unbind', args);
        args = args[0] = null;
    }
    node = null;
    return component;
}

function beforeUnbind(component) {
    if (!component.detached) {
        detach(component);
    }
}

function afterUnbind(component) {
    var id = component.id;
    LIBCORE.each(component, cleanupComponentCallback);
    
    // restore id
    component.id = id;
}

function cleanupComponentCallback() {
    delete arguments[2][arguments[1]];
}


/**
 * Component list management
 */
function createComponent(type) {
    var types = COMPONENT_TYPES,
        Class = types[LIBCORE.contains(types, type) ?
                            type : DEFAULT_TYPE],
        id = 'comp' + (++COMPONENT_ID_GEN),
        component = new Class();
        
    component.id = id;
    COMPONENTS[id] = component;
    
    return component;
}

function bindNode(node) {
    var CORE = LIBCORE,
        list = COMPONENTS,
        isString = CORE.string,
        typeAttr = COMPONENT_TYPE_ATTR,
        idAttr = COMPONENT_ID_ATTR,
        type = node.getAttribute(typeAttr),
        id = node.getAttribute(idAttr),
        component = null;
        
    var index;
    
    if (isString(type)) {
        
        // it's already registered
        if (isString(id)) {
            component = list[id];
            
        }
        else {
            // bless the zombie!
            index = findZombie(type);
            if (index !== -1) {
                // resurrect and unbind node
                component = resurrect(index);
                
            }
            // must create one
            else {
                component = createComponent();
                
            }
            
            bind(component, node);
        }
    }
    
    return component;
}

function findZombie(type) {
    var component = COMPONENTS,
        list = ZOMBIES,
        l = list.length;
        
    for (; l--;) {
        if (component[list[l]].type === type) {
            return l;
        }
    }
    return -1;
}

function resurrect(index) {
    var list = ZOMBIES,
        CORE = LIBCORE;
    var component;
    
    if (CORE.number(index) && index in list) {
        component = COMPONENTS[list[index]];
        list.splice(index, 1);
        unbind(component);
        return component;
    }
    return void(0);
}


/**
 * Component processing
 */



function processNodesFrom(node) {
    var dom = LIBDOM;
    
    if (dom.is(node, 1, 9, 11)) {
        dom.eachNodePreorder(
            node.nodeType === 9 ?
                node.body : node,
            onProcessNode);
    }
}

function onProcessNode(node) {
    var component = bindNode(node);
    if (component) {
        console.log('created component: ', component);
    }
    
}


/**
 * Component Base Class
 */
function Component() {
    
}


Component.prototype = {
    dom: void(0),
    type: DEFAULT_TYPE,
    
    detached: true,
    
    constructor: Component,
    
    onAttach: function () {
        
    },
    
    onDetach: function () {
        
    },
    
    onBind: function () {
        
    },
    
    onUnbind: function () {
        
    }
    
};

COMPONENT_TYPES[DEFAULT_TYPE] = Component;

registerMiddleware(true, 'bind', beforeBind);
registerMiddleware(false, 'bind', afterBind);
registerMiddleware(true, 'unbind', beforeUnbind);
registerMiddleware(false, 'unbind', afterUnbind);


LIBDOM.on(global, 'load',
    function () {
        processNodesFrom(global.document.body);
    });





module.exports = EXPORTS;