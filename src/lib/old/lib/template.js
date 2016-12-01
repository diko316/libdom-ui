'use strict';


var LIBCORE = require("libcore"),
    HTTP = require("libdom-http"),
    TEMPLATES = LIBCORE.createRegistry(),
    EXPORTS = {
        add: add,
        get: get
    };
    
    
function add(url, template) {
    var CORE = LIBCORE,
        isString = CORE.string;
    var loaded, obj;
    
    if (isString(url)) {
        
        loaded = true;
        
        if (CORE.array(template)) {
            template = template.join('\n');
        }
        
        if (!isString(template)) {
            template = '';
            loaded = false;
        }
        
        
        obj = {
            loaded: loaded,
            data: template
        };
        
        TEMPLATES.set(url, obj);
        return obj;
        
    }
    
    return null;
}

function get(url) {
    var P = Promise,
        templates = TEMPLATES;
    var obj;
    
    if (!LIBCORE.string(url)) {
        return P.reject("Invalid [url] parameter.");
    }
    
    obj = templates.get(url);
    
    // add url
    if (!obj) {
        obj = add(url);
    }
    
    if (!obj.loaded) {
        return HTTP(url).
                    then(function (response) {
                        return setupTemplate(url, response);
                    });
    }
    return P.resolve(obj.data);
}

function setupTemplate(url, response) {
    var obj = TEMPLATES.get(url),
        data = response.data;
    obj.loaded = true;
    
    if (LIBCORE.string(data)) {
        obj.template = data;
        return data;
    }
    
    return Promise.reject("Invalid template data");
}




module.exports = EXPORTS;