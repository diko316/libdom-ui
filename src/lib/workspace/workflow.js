'use strict';

import {
            on
        } from "libdom";

import { bind } from "./node.js";

function onDOMReady() {
    bootstrap(global.document.documentElement);
}




on(global.window, 'load', onDOMReady);


function bootstrap(element) {
    var apply = bind,
        depth = 0;
    var current, node;


    for (current = element; current;) {
        
        // process pre-order
        if (current.nodeType === 1) {
            apply(current);
        }

        // go into first child
        node = current.firstChild;

        if (node) {
            depth++;
        }
        // go next sibling or parentNode's nextSibling
        else {
            // process post-order
            // if (current.nodeType === 1) {
            //     bind(current);
            // }

            node = current.nextSibling;

            for (; !node && depth-- && current;) {
                current = current.parentNode;

                // process post-order
                // if (current.nodeType === 1) {
                //     bind(current);
                // }

                node = current.nextSibling;
            }
        }
        current = node;
    }


}


    