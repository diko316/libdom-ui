'use strict';

import {
            string,
            clear,
            createRegistry

        } from "libcore";


import {
            is
        } from "libdom";

import State from "./workspace/state.js";

import {
            instantiate,
            elementRoles as elementControls
         } from "./control.js";

import {
            elementRoles
        } from "./helper/roles.js";


var ID_GEN = 0;

const   ID_ATTR = '__uid__$$',
        INVALID_DOM = "Invalid [dom] element parameter.",
        REGISTRY = createRegistry();

function isBindable(dom) {
    var roles = elementRoles(dom);
    return !!roles.length && roles;
}


function isBound(dom) {
    var access = ID_ATTR;
    var id;
    
    if (access in dom) {
        id = access in dom[access];
        if (string(id) && REGISTRY.exists(id)) {
            return id;
        }
    }

    return false;
}

class Node {

    constructor(id) {
        this.attribute = {};
        this.cache = {};
        this.eventHandlers = [];
        this.state = new State(this);
        this.controls = {};
        this.controlNames = [];
        this.initialized = false;
        this.alive = true;
        this.id = id;
        this.dom =
            this.root =
            this.parent =
            this.first =
            this.last =
            this.previous =
            this.next = null;

        REGISTRY.set(id, this);
    }

    onInitialize(dom) {
        // setup control
        var me = this,
            camelify = camelize,
            controls = me.controls,
            names = me.controlNames,
            nl = 0,
            roles = elementControls(dom);
        var c, l, role, name;

        for (c = -1, l = roles.length; l--;) {
            role = roles[++c];
            name = camelify(role);
            names[nl++] = name;
            controls[name] = instantiate(role, me);
        }

    }

    onBind() {

    }

    onUnbind() {

    }

    onDestroy() {
        var clearObject = clear;

        // unbind dom
        this.unbind();

        // unset child
        this.root =
            this.parent =
            this.first =
            this.last =
            this.previous =
            this.next = null;

        clearObject(this.cache);
        clearObject(this);
    }

    eachControl(handler) {
        var me = this,
            names = me.controlNames,
            controls = me.controls,
            c = -1,
            l = names.length,
            operation = {
                node: me,
                returnValue: undefined
            };

        for (; l--;) {
            if (handler(operation, controls[names[++c]]) === false) {
                operation.returnValue = false;
                break;
            }
        }

        operation.node = null;
        return operation.returnValue;

    }

    bind(dom) {
        
        if (this.dom !== dom) {

            // unbind old dom
            this.unbind();

            // setup
            this.dom = dom;
            dom[ID_ATTR] = this.id;

            if (!this.initialized) {
                this.initialized = true;
                this.onInitialize(dom);
            }

            this.onBind(dom);
        }
        
        return this;
    }

    unbind() {
        var dom = this.dom;

        if (dom) {
            this.onUnbind(dom);
            delete dom[ID_ATTR];
        }

        this.dom = 
            dom = null;

        return this;
    }

    destroy() {
        var id;

        if (this.alive) {
            id = this.id;
            this.onDestroy();
            REGISTRY.unset(id);
        }

        return this;
    }


}


export { Node };


export
    function bind(dom) {
        var access = ID_ATTR;
        var id, instance;

        if (!is(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        id = isBound(dom);
        if (id) {
            return id;
        }

        if (!isBindable(dom)) {
            return null;
        }

        dom[access] = id = 'n' + (++ID_GEN);
        instance = new Node(id);
        instance.bind(dom);
        instance = null;

        return id;

    }

export
    function unbind(dom) {
        var id = null;

        if (!is(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        id = isBound(dom);
        if (id) {
            REGISTRY.get(id).unbind();
            return id;
        }

        return null;

    }

export
    function compile(dom, descendantsOnly) {
        var apply = bind,
            bindable = isBindable,
            depth = 0;

        var current, node, binds, bl, id;

        if (!is(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        if (descendantsOnly !== true) {
            return apply(dom);

        }

        binds = [];
        bl = 0;

        // bind descendants
        for (current = dom; current;) {

            if (current.nodeType === 1) {

                // bind descendant
                if (depth && bindable(current)) {
                    binds[bl++] = apply(current);

                }
                // go inside
                else {
                    node = current.firstChild;
                    if (node) {
                        depth++;
                        current = node;
                        continue;
                    }
                }

            }

            // go to next node
            node = current.nextSibling;
            
            for (; !node && depth-- && current;) {
                current = current.parentNode;
                node = current.nextSibling;
            }

            current = node;

        }
        

        return bl ? binds : null;

    }

export default Node;
