'use strict';

function Base() {
    
}

Base.prototype = {
    eventHandlers: [],
    requires: [],
    constructor: Base,
    onClick: function () {
        console.log('clicked!', arguments);
    },
    destroy: function () {
    }
};


module.exports = Base;