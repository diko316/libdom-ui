'use strict';

import { clear } from "libcore";

import { generate } from "../core/id.js";


export
    function getNodeType(type) {
        switch (type) {
        case 1: return 'ELEMENT_NODE';
        case 2: return 'ATTRIBUTE_NODE';
        case 3: return 'TEXT_NODE';
        case 4: return 'CDATA_SECTION_NODE';
        case 5: return 'ENTITY_REFERENCE_NODE';
        case 6: return 'ENTITY_NODE';
        case 7: return 'PROCESSING_INSTRUCTION_NODE';
        case 8: return 'COMMENT_NODE';
        case 9: return 'DOCUMENT_NODE';
        case 10: return 'DOCUMENT_TYPE_NODE';
        case 11: return 'DOCUMENT_FRAGMENT_NODE';
        case 12: return 'NOTATION_NODE';
        }
        return null;
    }

export default
    class Node {
        constructor(type) {
            if (!getNodeType(type)) {
                throw new Error("Invalid node [type] parameter.");
            }

            this.objectId = generate('node');
            this.alive = true;

            this.control = null;
            
            this.nodeType = type;

            this.nodeName =
            this.nodeValue =
            this.root =
                this.parent =
                this.before = 
                this.after =
                this.first =
                this.last = null;
        }

        add(node, before) {
            var parent = node.parent,
                first = this.first,
                last = this.last;
            var after;

            // unset parent
            if (parent) {
                parent.remove(node);
            }

            node.parent = this;

            // insert
            if (before) {
                after = before;
                before = before.before;
            }
            else {
                before = this.last;
                after = null;
            }

            if (after) {
                node.after = after;
                after.before = node;
            }

            if (before) {
                node.before = before;
                before.after = node;
            }

            if (!first || first === after) {
                this.first = node;
            }

            if (!last || last === before) {
                this.last = node;
            }

            return node;

        }

        remove(node) {
            var first, last, before, after;

            if (node.parent !== this) {
                return null;
            }

            before = node.before;
            after = node.after;
            first = this.first;
            last = this.last;

            if (before) {
                before.after = after;
            }
            if (after) {
                after.before = before;
            }

            if (first === node) {
                this.first = after;
            }

            if (last === node) {
                this.last = before;
            }

            return node;

        }

        destroy() {
            var root, pointer, next, control;

            if (this.alive) {
                delete this.alive;

                pointer = this.last;
                for (;pointer; pointer = next) {
                    next = pointer.before;
                    pointer.destroy();
                }

                // destroy control
                control = this.control;
                if (control) {
                    control.destroy();
                }

                root = this.root;
                if (root) {
                    root.destroyNode(this);
                }

                clear(this);
            }

        }

    }
