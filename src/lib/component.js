'use strict';

var LIBCORE = require("libcore"),
    LIBDOM = require("libdom"),
    COMPONENT_TYPE_ATTR = 'role',
    COMPONENT_ID_ATTR = 'data-id',
    COMPONENT_ID_GEN = 0,
    DEFAULT_TYPE = 'presentation',
    COMPONENT_TYPES = {},
    COMPONENTS = {},
    MIDDLEWARE = LIBCORE.middleware('libdom-ui.component'),
    ZOMBIES = [],
    EXPORTS = {
        get: getComponent,
        destroy: destroyComponent
    };


/**
 * Component life cycle
 */
function bind(component, node) {
    var run = MIDDLEWARE.run,
        args = [component, node];
    
    //run(true, 'bind', args);
    run('before:bind', args);
    component.onBind(node);
    run('before:bind', args);
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
        run = MIDDLEWARE.run;
    var args;
    
    if (node && component.detached &&
        LIBDOM.contains(node.ownerDocument, node)) {

        args = [component, node];
        run('before:attach', args);
        component.detached = false;
        component.onAttach();
        run('after:attach', args);
        args = args[0] = args[1] = null;
        
    }
    node = null;
    return component;
}


function detach(component) {
    var node = component.dom,
        run = MIDDLEWARE.run;
    var args;
        
    if (node && !component.detached &&
        !LIBDOM.contains(node.ownerDocument, node)) {
        args = [component, node];
        run('before:detach', args);
        component.detached = true;
        component.onDetach();
        run('after:detach', args);
        args = args[0] = args[1] = null;
    }
    node = null;
    return component;
}

function unbind(component) {
    var run = MIDDLEWARE.run,
        node = component.dom;
    var args;
    
    if (node) {
        args = [component];
        run('before:unbind', args);
        component.dom = null;
        run('after:unbind', args);
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

function afterUnbind() {
    
}

function destroy(component) {
    var run = MIDDLEWARE.run;
    var args;
    
    if (!component.destroyed) {
        args = [component];
        run('before:destroy', args);
        component.onDestroy();
        run('after:destroy', args);
        args = args[0] = null;
    }
    return component;
}

function beforeDestroy(component) {
    // unbind first!
    if (component.dom) {
        unbind(component);
    }
}

function afterDestroy(component) {
    var list = ZOMBIES,
        id = component.id;
    
    // turn it to zombie
    list[list.length] = id;
   
   // cleanup
    LIBCORE.clear(component);
    component.id = id;
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

function destroyComponent(id) {
    var component = getComponent(id);
    if (component) {
        destroy(component);
    }
    return EXPORTS;
}

function getComponent(id) {
    var list = COMPONENTS;
    if (LIBCORE.contains(list, id)) {
        return list[id];
    }
    return void(0);
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
    var components = COMPONENTS,
        list = ZOMBIES,
        l = list.length;
        
    for (; l--;) {
        if (components[list[l]].type === type) {
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
    this.destroyed = false;
    MIDDLEWARE.run('instantiate', [this]);
}


Component.prototype = {
    dom: void(0),
    type: DEFAULT_TYPE,
    
    detached: true,
    destroyed: true,
    
    constructor: Component,
    
    onAttach: function () {
        
    },
    
    onDetach: function () {
        
    },
    
    onBind: function () {
        
    },
    
    onUnbind: function () {
        
    },
    
    onDestroy: function () {
        
    }
    
};

COMPONENT_TYPES[DEFAULT_TYPE] = Component;

MIDDLEWARE.
    register('before:bind', beforeBind).
    register('bind', afterBind).
    
    register('before:unbind', beforeUnbind).
    register('unbind', afterUnbind).
    
    register('before:destroy', beforeDestroy).
    register('destroy', afterDestroy);


LIBDOM.on(global, 'load',
    function () {
        processNodesFrom(global.document.body);
    });





module.exports = EXPORTS;