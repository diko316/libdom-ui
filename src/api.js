'use strict';

import { on } from "libdom";

import { compile } from "./lib/node.js";

// initialize DOM when ready
function onDOMReady() {
    var root = global.document.documentElement;

    // compile root, or compile descendants
    if (!compile(root, null)) {

        compile(root, null, true);
        
    }

    root = null;
    
}

on(global.window, 'load', onDOMReady);

export {
            default as BaseControl

        } from "./lib/control/base.js";

export {

            register as registerControl,
            exists as controlExists

        } from "./lib/control.js";