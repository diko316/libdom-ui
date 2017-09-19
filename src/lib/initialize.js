'use strict';




function onDOMReady() {
    bootstrap(global.document.documentElement);
}




on(global.window, 'load', onDOMReady);