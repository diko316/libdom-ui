'use strict';

import {
            assign,
            clear
        } from "libcore";

import { generate } from "../core/id.js";

class Node {
    constructor() {
        this.objectId = generate('node');
        this.alive = true;
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
        var root, pointer, next;

        if (this.alive) {
            delete this.alive;

            pointer = this.last;
            for (;pointer; pointer = next) {
                next = pointer.before;
                pointer.destroy();
            }

            root = this.root;
            if (root) {
                root.destroyNode(this);
            }

            clear(this);
        }

    }

}

assign(Node.prototype, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
});


export default Node;