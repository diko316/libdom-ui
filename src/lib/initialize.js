'use strict';

import { compile } from "./node.js";

function onDOMReady() {
    compile(global.document.documentElement, true);
}

on(global.window, 'load', onDOMReady);