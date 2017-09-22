'use strict';

import {
            string,
            clear,
            createRegistry,
            camelize

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
        } from "./helper.roles.js";


let ID_GEN = 0;

const   ID_RE = /^n[1-9][0-9]*$/,
        ID_ATTR = '__uid__$$',
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
            controls[name] = instantiate(name, me);
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

    onSetupControl(role, instance) {

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
        var registry = REGISTRY,
            access = ID_ATTR;
        var id, instance;

        if (!is(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        id = isBound(dom);
        if (id) {
            return id;
        }

        if (isBindable(dom)) {
            
        }

        id = access in dom ? dom[access] : null;
        switch (true) {
        // generate id
        case !string(id) || !ID_RE.test(id):
            dom[access] = id = 'n' + (++ID_GEN);
        
        // create
        /* falls through */
        case !registry.exists(id):
            instance = new Node(id);
            break;

        default:
            instance = registry.get(id);
        }

        instance.bind(dom);
        instance = null;

        return id;
    }

export
    function unbind(dom) {
        var registry = REGISTRY,
            access = ID_ATTR;
        var id = null;

        if (!is(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        if (access in dom) {
            id = dom[access];
            if (registry.exists(id)) {
                registry.get(id).unbind();
                return id;
            }
        }

        return null;
    }

export
    function compile(dom, descendantsOnly) {
        var apply = bind,
            bindable = isBindable,
            depth = 0;
        var current, node, binds, bl;

        if (!is(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        if (descendantsOnly !== true) {
            
            if (bindable(dom)) {
                return apply(dom);
            }

            return false;

        }

        binds = [];
        bl = 0;

        // bind descendants
        for (current = dom; current;) {

            if (current.nodeType === 1) {

                // bind
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

        return binds;

    }

export default Node;
