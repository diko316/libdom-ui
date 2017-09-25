'use strict';

import { createRegistry } from "libcore";

import { is } from "libdom";

import { compile } from "../role/dom.js";

import Node from "./node.js";

import Element from "./element.js";

import Text from "./text.js";


export default
    class Document extends Node {

        constructor(documentNode) {
            super(9);
            this.nodeList = createRegistry();

            // link and mount
            this.link(documentNode);

            // mount dom from documentElement
            compile(this, documentNode.documentElement);
        }

        onCreateNode(node) {
            this.nodeList.set(node.objectId, node);
        }

        onDestroyNode(node) {
            this.nodeList.unset(node.objectId);
        }

        link(dom) {

            if (!is(dom, 9)) {
                throw new Error("Invalid [dom] Document Node parameter.");
            }

            return super.link(dom, 'document');
            
        }

        createElement() {
            var node;
            
            node = new Element();
            node.root = this;
            this.onCreateNode(node);

            return node;
            
        }

        createTextNode() {
            var node;
            
            node = new Text();
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
