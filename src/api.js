'use strict';

import {
            on,
            destructor
        
        } from "libdom";

import Document from "./virtual/document.js";

//import { createContext } from "./process/linker.js";

import "./control/index.js";





var DOCUMENT = null;

// initialize DOM when ready
function onDOMReady() {
    DOCUMENT = new Document(global.document);
}

function onDOMDestroy() {
    var doc = DOCUMENT;

    if (doc) {
        doc.destroy();
    }

    DOCUMENT = doc = null;
}





on(global.window, 'load', onDOMReady);

destructor(onDOMDestroy);
