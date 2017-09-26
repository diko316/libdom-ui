'use strict';

import {
            browserReady,
            browserEnd
        } from "./event/index.js";

import Document from "./virtual/document.js";

import "./control/index.js";

// test
import "./expression/parser.js";


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

browserReady(onDOMReady);

browserEnd(onDOMDestroy);


export {
            browserReady,
            browserEnd
    };