'use strict';



var LIBCORE = require("libcore"),
    BASE = require("./base.js"),
    SPLIT_RE = /[ \r\n\t\s]+/,
    PAIR_RE = /^([^\=]+)\=([^\=]+)$/;

function Data() {
    
}

Data.prototype = LIBCORE.instantiate(BASE, {
    names: null,
    constructor: Data,
    dataAttr: 'data-listen',
    
    importState: function () {
        var CORE = LIBCORE,
            isObject = CORE.object,
            find = CORE.jsonFind,
            me = this,
            names = me.names,
            node = me.node,
            stateData = node && node.data;
            
        var c, l, item, property, access, parent, parentData, clear;
        
        if (isObject(stateData) && CORE.array(names)) {
            parent = node.parent;
            parentData = parent ? parent.data : null;
            clear = !isObject(parentData);
            
            for (c = -1, l = names.length; l--;) {
                item = names[++c];
                access = item[0];
                
                if (!clear) {
                    property = find(item[1]);
                    if (typeof property !== 'undefined') {
                        stateData[access] = property;
                        continue;
                    }
                }
                delete stateData[access];
            }
            names = item = null;
        }
        
        return me;
    },
    
    clearState: function () {
        var CORE = LIBCORE,
            me = this,
            node = me.node,
            stateData = node && node.data,
            names = me.names;
        var l;
        
        if (CORE.object(stateData) && CORE.array(names)) {
            for (l = names.length; l--;) {
                delete stateData[names[l]];
            }
        }
        return me;
    },
    
    onInitialize: function () {
        var me = this,
            CORE = LIBCORE,
            pairRe = PAIR_RE,
            access = me.component("lib-dom").attribute(me.dataAttr),
            names = [],
            nl = 0;
        var c, l, item;
        
        // create names from parsed access
        if (CORE.string(access)) {
            access = access.split(SPLIT_RE);
            
            for (c = -1, l = access.length; l--;) {
                item = access[++c].match(pairRe);
                if (item) {
                    names[nl++] = [item[1], item[2]];
                }
            }
            
        }
        
        this.names = names;
    },
    
    onParentStateChange: function () {
        this.importState();
    }
    
});



module.exports = Data;
