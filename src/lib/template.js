'use strict';


var LIBCORE = require("libcore"),
    TEMPLATES = LIBCORE.createRegistry(),
    EXPORTS = {
        add: add,
        get: get,
        exist: exist
    };
    
    
function add(url, template) {
    var CORE = LIBCORE;
    var type;
    
    if (CORE.string(url)) {
        if (CORE.array(template)) {
            template = template.join('\n');
        }
        type = CORE.string(template) ? 'string' :
                    CORE.object(template) ? 'object' :
                        CORE.array(template) ? 'array' :
                            null;
        if (type) {
            TEMPLATES.set(url, {
                type: type,
                data: template
            });
        }
    }
    
    return EXPORTS;
}

function get(url) {
    return TEMPLATES.get(url);
}

function exist(url) {
    return !!TEMPLATES.get(url);
}

module.exports = EXPORTS;