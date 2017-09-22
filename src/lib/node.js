'use strict';

import {
            string,
            thenable,
            clear,
            createRegistry

        } from "libcore";


import {
            is
        } from "libdom";

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

function bind(dom, parent) {
    var access = ID_ATTR;
    var id, instance, item;

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

    // attach parent and resolve node relationships
    if (parent) {
        instance.parent = parent;
        instance.root = parent.root || parent;

        if (!parent.first) {
            parent.first = instance;
        }
        else {
            item = parent.last;
            item.next = instance;
            instance.previous = item;
        }
        parent.last = instance;
    }

    instance.bind(dom);
    instance = null;

    return id;

}

class Node {

    constructor(id) {
        this.attribute = {};
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
        
        var me = this,
            controls = me.controls,
            names = me.controlNames,
            pending = [],
            nl = 0,
            roles = elementControls(dom);
        var c, l, role, name, instance;

        // setup control
        this.pendingControls = pending = [];

        for (c = -1, l = roles.length; l--;) {
            role = roles[++c];
            instance = instantiate(role, me);
            name = instance.name;
            controls[name] = instance;
            names[nl++] =
                pending[nl] = name;
        }

        // prepare all controls
        me.eachControl((control) => {
            var result;

            // initialize control
            control.initialize();

            result = control.prepare();

            if (thenable(result)) {
                result.
                    then(() => this.onControlPrepared(control),
                        (e) => {
                            console.warn(e);
                            this.destroy();
                            throw new Error(e);
                        });
            }
            else {
                this.onControlPrepared(control);
            }

        });

    }

    onControlPrepared(control) {
        var list = this.pendingControls;
        var index, dom;
            
        if (list) {
            index = list.indexOf(control);

            if (index !== -1) {
                list.splice(index, 1);
            }

            if (!list.length) {
                dom = this.dom;
                if (dom) {
                    this.onBind(dom);
                }
                this.pendingControls = false;
            }
        }
    }

    onDestroyController(control) {
        control.destroy();
        this.controls[control.name] = null;
    }

    onBind(dom) {
        var len = 0,
            roleAttrs = [];


        // replace role attribute with new one
        this.eachControl(control => control.applyRoleAria && roleAttrs[len++]);

        if (len) {
            dom.setAttribute('role', roleAttrs.join(' '));
        }


    }

    onUnbind() {

    }

    onDestroy() {
        var clearObject = clear,
            me = this,
            parent = me.parent,
            next = me.next,
            previous = me.previous,
            pointer = me.first;

        var names, child;

        // destroy children
        for (; pointer; ) {
            child = pointer;
            pointer = pointer.next;
            child.destroy();
        }


        // unset controllers
        if (me.initialized) {
            me.eachControl(control => this.onDestroyController(control));
            
            // purge names
            names = me.controlNames;
            names.splice(0, names.length);
            me.controls =
                me.controlNames =
                names = null;
        }

        // unbind dom
        me.unbind();

        // remove relationship
        if (parent) {
            if (previous) {
                previous.next = next;
            }
            if (next) {
                next.previous = previous;
            }
            
            if (parent.first === me) {
                parent.first = previous || next;
            }

            if (parent.last === me) {
                parent.last = next || previous;
            }
        }

        // unset child
        me.root =
            me.parent =
            me.first =
            me.last =
            me.previous =
            me.next = 
            parent = 
            previous = 
            next = null;

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
            if (handler(controls[names[++c]], operation) === false) {
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

            // bind later when ready
            if (!this.initialized) {
                this.initialized = true;
                this.onInitialize(dom);
            
            }
            else {
                this.onBind(dom);
            }
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
    function compile(dom, parent, descendantsOnly) {
        var apply = bind,
            isDom = is,
            bindable = isBindable,
            depth = 0;

        var current, node, binds, bl;

        if (!isDom(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        if (!isDom(parent, 1)) {
            parent = null;
        }

        if (descendantsOnly !== true) {
            return apply(dom, parent);

        }

        binds = [];
        bl = 0;

        // bind descendants
        for (current = dom; current;) {

            if (current.nodeType === 1) {

                // bind descendant
                if (depth && bindable(current)) {
                    binds[bl++] = apply(current, parent);

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
