'use strict';

var main = require("./index.js");

global.main = main;

module.exports = main;

// yes it works now
//require("./test/event-bus.js");


require("./test/node.js");