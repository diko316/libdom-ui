'use strict';



var LIBCORE = require("libcore"),
    BASE = require("./base.js");

function Data() {
    
}

Data.prototype = LIBCORE.instantiate(BASE, {
    constructor: Data
});



module.exports = Data;
