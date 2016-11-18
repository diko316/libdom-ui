'use strict';

var LIBCORE = require("libcore"),
    Base = require("./base.js");

function Main() {
    Base.apply(this, arguments);
}

Main.prototype = LIBCORE.instantiate(Base, {
    
    constructor: Main
    
});


module.exports = Main;