'use strict';

import { register } from "../role/registry.js";

import domControl from "./dom.js";

import documentControl from "./document.js";

import textControl from "./text.js";



// register all mixins
register('dom', domControl);

register('document', documentControl,
        ['dom']);

register('text', textControl,
        ['dom']);