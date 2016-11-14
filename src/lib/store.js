'use strict';

var LIBCORE = require("libcore"),
    isString = LIBCORE.string,
    DATA = require("./data-path.js");

function Store() {
    this.data = {};
}


Store.prototype = {
    data: null,
    constructor: Store,
    set: function (path, value, overwrite) {
        return isString(path) &&
                DATA.assign(path, this.data, value, overwrite);
    },
    unset: function (path) {
        return isString(path) && DATA.remove(path, this.data);
    },
    compare: function (path, data) {
        var my = this.data,
            compare = DATA.compare;
        
        return isString(path) ?
                    compare(DATA.find(path, my), data) :
                    compare(my, data);
        
    },
    clone: function (path, deep) {
        var my = this.data,
            clone = DATA.clone;
            
        return isString(path) ?
                    clone(path, my, deep) :
                    clone(my, deep);
    },
    clear: function (){
        var me = this;
        LIBCORE.clear(me.data);
        return me;
    }
};


module.exports = Store;