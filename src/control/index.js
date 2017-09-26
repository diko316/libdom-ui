'use strict';

import { register } from "../role/registry.js";

// lib
import libStatefulControl from "./lib/stateful.js";
import libDomControl from "./lib/dom.js";
import libDocumentControl from "./lib/document.js";
import libCommentControl from "./lib/comment.js";




// register lib
register(libStatefulControl);
register(libDomControl);
register(libDocumentControl);
register(libCommentControl);