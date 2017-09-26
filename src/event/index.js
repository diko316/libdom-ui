'use strict';

import { middleware } from "libcore";

import {
            register,
            run,
            runAsync
        } from "./loop.js";

import {
            browserReady,
            browserEnd
        } from "./dom.js";

var MIDDLEWARE = middleware('libdom.event'),
    READY = false;

function onDOMEventDispatch() {
    if (READY) {
        run();
    }
}

function onDOMReady() {
    READY = true;
}


// register EVENT middleware
MIDDLEWARE.register('dispatch', onDOMEventDispatch);

browserReady(onDOMReady);

export {
            browserReady,
            browserEnd,
            register as eventRegister,
            run as eventRun,
            runAsync as eventRunAsync
        };