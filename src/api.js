'use strict';

import { on } from "libdom";

import { compile } from "./lib/node.js";

var stopEvent;

// initialize
function onDOMReady() {
    stopEvent();
    stopEvent = null;

    compile(global.document.documentElement, true);
}

stopEvent = on(global.window, 'load', onDOMReady);

export {
            default as BaseControl

        } from "./lib/control/base.js";

export {

            register as registerControl,
            exists as controlExists

        } from "./lib/control.js";