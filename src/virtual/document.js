'use strict';

import { createRegistry } from "libcore";

import Node,
        {
            getNodeType
        } from "./node.js";

export default
    class Document extends Node {

        constructor() {
            super(9);
            this.nodeList = createRegistry();
        }

        onCreateNode(node) {
            this.nodeList.set(node.objectId, node);
        }

        onDestroyNode(node) {
            this.nodeList.unset(node.objectId);
        }

        createNode(type) {
            var node;

            if (!getNodeType(type)) {
                throw new Error("Invalid node [type] parameter.");
            }
            
            node = new Node(type);

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
