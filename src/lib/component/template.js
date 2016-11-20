'use strict';


var LIBCORE = require("libcore"),
    TEMPLATE = require("../template.js"),
    BASE = require("./base.js");


function Template() {
    
}

Template.prototype = LIBCORE.instantiate(BASE, {
    requires: ["lib-dom"],
    templateAttr: 'data-template',
    
    constructor: Template,
    
    onInitialize: function () {
        var me = this,
            promises = arguments[2],
            template = me.component("lib-dom").attribute(me.templateAttr);
        
        if (LIBCORE.string(template)) {
            me.set('template.url', template);
            promises[promises.length] = TEMPLATE.get(template).
                                            then(function (data) {
                                                me.applyTemplate(data);
                                            });
        }

    },
    
    applyTemplate: function (data) {
        var dom = this.component("lib-dom").dom();
        
        if (dom) {
            this.node.destroyChildren(dom);
            dom.innerHTML = data;
        }
    },
    
    onStateChange: function (event) {
        console.log('state change! ', event.data);
    }
    
});

module.exports = Template;
