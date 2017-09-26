'use strict';

import { is } from "libdom";

import Node from "./node.js";


export default
    class Comment extends Node {
        constructor() {
            super(8);
            this.leafy = true;
        }

        link(dom) {

            if (!is(dom, 8)) {
                throw new Error("Invalid [dom] Text Node parameter.");
            }

            return super.link(dom, 'lib-comment');
            
        }
    }