'use strict';

import { createRegistry } from "libcore";

import Node from "./node.js";

class Document extends Node {

    constructor() {
        super();
        this.nodeList = createRegistry();
    }

    onCreateNode(node) {
        this.nodeList.set(node.objectId, node);
    }

    onDestroyNode(node) {
        this.nodeList.unset(node.objectId);
    }


    createNode() {
        var node = new Node();

        node.root = this;
        this.onCreateNode(node);

        return node;
    }

    destroyNode(node) {

        if (node.root === this) {

            this.onDestroyNode(node);

        }

        return this;
    }
}


export default Document;