'use strict';

import Node from "./node.js";


export default
    class Document extends Node {

        get nodeType() {
            return this.DOCUMENT_NODE;
        }

        createElement() {
            
        }
    }