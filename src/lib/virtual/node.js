'use strict';

import Defaults from "./defaults.js";

import { generate } from "../helper/id.js";

var NULL = null;

export default
    class Node extends Defaults {
        constructor() {
            var NIL = NULL;

            Object.defineProperty(this,
                                'objectId',
                                {
                                    enumerable: false,
                                    writable: false,
                                    configurable: false,
                                    value: generate('n')
                                });

            Object.defineProperty(this,
                                '$',
                                {
                                    enumerable: false,
                                    writable: false,
                                    configurable: false,
                                    value: {
                                        name: NIL,
                                        value: NIL,
                                        parent: NIL,
                                        first: NIL,
                                        last: NIL,
                                        previous: NIL,
                                        next: NIL,
                                        owner: NIL
                                    }

                                });
        }

        get nodeName() {
            return this.$.name;
        }

        get nodeValue() {
            return this.$.value;
        }

        get nodeType() {
            return 0;
        }

        get ownerDocument() {
            return this.$.owner;
        }

        get parentNode() {
            return this.$.parentNode;
        }

        get firstChild() {
            return this.$.firstChild;
        }

        get lastChild() {
            return this.$.lastChild;
        }

        get previousSibling() {
            return this.$.previousSibling;
        }

        get nextSibling() {
            return this.$.previousSibling;
        }

        insertBefore(newChild, refChild) {
            var Class = Node,
                store = this.$;
            var parent, childStore, refChildStore, id,
                previous, next, first, last;

            if (newChild instanceof Class) {

                childStore = newChild.$;
                
                // remove
                parent = childStore.parent;
                if (parent) {
                    parent.removeChild(newChild);
                }

                first = store.first;
                last = store.last;

                if (refChild instanceof Class) {
                    refChildStore = refChild.$;

                    if (refChildStore.parent !== this) {
                        throw new
                            Error(`refChild ${id} is not found as childNode.`);
                    }
                    previous = refChildStore.previous;
                    next = refChild;
                }
                else {
                    previous = last;
                    next = NULL;
                }

                // insert
                newChild.previous = previous;
                if (previous) {
                    previous.$.next = newChild;
                }

                newChild.next = next;
                if (next) {
                    next.$.previous = newChild;
                }

                if (!first || first === next) {
                    store.first = newChild;
                }
                
                if (!last || last === previous) {
                    store.last = newChild;
                }

                return newChild;
                
            }

            return null;

        }

        appendChild(newChild) {
            return this.insertBefore(newChild, null);
        }

        removeChild(node) {
            var store = this.$;
            var id, childStore, previous, next;

            if (node instanceof Node) {
                childStore = node.$;

                if (childStore.parent !== this) {
                    throw new Error(`node ${id} is not found as childNode.`);
                }
                
                previous = childStore.previous;
                next = childStore.next;

                if (previous) {
                    previous.$.next = next;
                }

                if (next) {
                    next.$.previous = previous;
                }
                
                if (store.first === node) {
                    store.first = previous || next;
                }

                if (store.last === node) {
                    store.last = next || previous;
                }

                childStore.parentNode =
                    childStore.previous =
                    childStore.next = NULL;

                return node;
                
            }

            return null;
        }

        
        
    }
