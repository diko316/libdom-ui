'use strict';



var LIBCORE = require("libcore"),
    BASE = require("./base.js");

function Data() {
    
}

Data.prototype = LIBCORE.instantiate(BASE, {
    constructor: Data,
    dataAttr: 'data-listen',
    
    importState: function () {
        
    },
    
    onInitialize: function (node) {
        var me = this,
            data = me.component("lib-dom").attribute(me.dataAttr);
    },
    
    onParentStateChange: function (node) {
        
    }
    
});



module.exports = Data;
