'use strict';

var LIBCORE = require('libcore'),
    base = require("../component.js").base,
    Base = base.constructor;

function Application() {
    Base.apply(this, arguments);
}


Application.prototype = LIBCORE.instantiate(Base, {
    constructor: Application
});


module.exports = Application;