'use strict';

import { is } from "libdom";

import Node from "./node.js";


export default
    class Text extends Node {
        constructor() {
            super(3);
            this.leafy = true;
        }

        link(dom) {

            if (!is(dom, 3)) {
                throw new Error("Invalid [dom] Text Node parameter.");
            }

            return super.link(dom, 'text');
            
        }
    }