'use strict';


var LIBCORE = require("libcore"),
    NODE = require("../node.js"),
    TEMPLATE = require("../template.js"),
    BASE = require("./base.js");


function Template() {
    
}

Template.prototype = LIBCORE.instantiate(BASE, {
    requires: ["lib-dom"],
    constructor: Template,
    templateAttr: 'data-template',
    onInitialize: function () {
        var me = this,
            promises = arguments[2],
            template = me.component("lib-dom").attribute(me.templateAttr);
        
        if (LIBCORE.string(template)) {
            promises[promises.length] = TEMPLATE.get(template).
                                            then(function (data) {
                                                me.applyTemplate(data);
                                            });
        }

    },
    
    applyTemplate: function (data) {
        var dom = this.component("lib-dom").dom();
        
        if (dom) {
            NODE.destroyChildren(dom);
            dom.innerHTML = data;
        }
    }
});

module.exports = Template;
