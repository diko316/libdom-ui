'use strict';

function Base() {
    
}

Base.prototype = {
    requires: [],
    constructor: Base,
    component: function (component) {
        var node = this.node;
        return node ? node.component(component) : null;
    },
    call: function (component, args) {
        var node = this.node;
        if (node) {
            component = node.component(component);
            if (component) {
                return component.apply(component, args || []);
            }
        }
        return void(0);
    },
    dispatch: function (event, message) {
        var node = this.node;
        if (node && !node.destroyed) {
            return node.dispatch(event, message);
        }
        return Promise.reject('Node control is currently not available');
    },
    destroy: function () {
    }
};


module.exports = Base;