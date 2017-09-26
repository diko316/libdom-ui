'use strict';


import {
            on,
            destructor
        } from "libdom";


var READY = false,
    READY_HANDLERS = [],
    STOP_OBSERVE = on(global.window, 'load', onDOMReady);

function onDOMReady() {
    var list = READY_HANDLERS;
    var c, l, item;

    STOP_OBSERVE();

    if (!READY) {
        READY = true;

        for (c = -1, l = list.length; l--;) {
            item = list[++c];
            try {
                item[0].call(item[1]);
            }
            catch (e) {
                console.warn(e);
            }
            item.length = 0;
        }
        list.length = 0;
    }

}

export
    function browserReady(handler, context) {
        var list = READY_HANDLERS;

        if (READY) {
            try {
                handler.call(context);
            }
            catch (e) {
                console.warn(e);
            }
        }
        else {
            list[list.length] = [handler, context];
        }
    }

export
    function browserEnd(handler, context) {
        function onEnd() {
            try {
                handler.call(context);
            }
            catch (e) {
                console.warn(e);
            }
        }
        destructor(onEnd);
    }