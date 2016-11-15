'use strict';

function Base() {
    
}

Base.prototype = {
    eventHandlers: [],
    requires: [],
    constructor: Base,
    destroy: function () {
    }
};


module.exports = Base;