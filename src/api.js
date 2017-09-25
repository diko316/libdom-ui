'use strict';

import {
            on,
            destructor
        
        } from "libdom";

import { register } from "./role/registry.js";

import { createContext } from "./process/linker.js";

import domControl from "./control/dom.js";

import documentControl from "./control/document.js";





var DOCUMENT = null;

// initialize DOM when ready
function onDOMReady() {
    DOCUMENT = createContext(global.document);
}

function onDOMDestroy() {
    var doc = DOCUMENT;

    if (doc) {
        doc.destroy();
    }

    DOCUMENT = doc = null;
}


// register all mixins
register('dom', domControl);
register('document', documentControl,
        ['dom']);


on(global.window, 'load', onDOMReady);

destructor(onDOMDestroy);
