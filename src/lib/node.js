'use strict';

import {
            string,
            clear,
            createRegistry

        } from "libcore";


import {
            is
        } from "libdom";

import State from "./node/state.js";


let ID_GEN = 0;

const   ID_RE = /^n[1-9][0-9]*$/,
        ID_ATTR = '__uid__$$',
        INVALID_DOM = "Invalid [dom] element parameter.",
        REGISTRY = createRegistry();


class Node {

    constructor(id) {
        this.attribute = {};
        this.cache = {};
        this.eventHandlers = [];
        this.state = new State(this);
        this.controls = [];
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

    setupControl(role, instance) {

    }

    bind(dom) {
        
        if (this.dom !== dom) {

            // unbind old dom
            this.unbind();

            this.dom = dom;
            dom[ID_ATTR] = this.id;
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


export default Node;
