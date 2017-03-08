'use strict';

var CONTEXT = require('./context.js'),
    DOM = require('./dom.js');








function bind(dom, context) {
    console.log('binding ', dom, ' and ', context);
}

function start() {
    var dom = global.document.documentElement;
    
    DOM.setRoles(dom, 'application');
    
    bind(dom, CONTEXT.root);
    
    dom = null;

}


module.exports = {
    bind: bind,
    start: start
};