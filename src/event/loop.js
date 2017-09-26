'use strict';

import {
            method,
            compare,
            clone,
            clearAsync,
            setAsync
        } from "libcore";

const   RUNNERS = [],
        STATUS = {
            async: false,
            running: false,
            cycles: 0
        };



export
    function register(getter, handler) {
        var list = RUNNERS,
            CACHE = void(0);

        function callback() {
            var current = CACHE;
            var newValue;

            if (callback.handler) {
                newValue = undefined;

                try {
                    newValue = handler(current);
                }
                catch (e) {
                    console.warn(e);
                }

                // compare with cache
                if (!compare(current, newValue)) {
                    CACHE = clone(newValue, true);
                    return true;
                }
            }

            return false;

        }

        function stop() {
            var runners = list,
                target = callback;
            var index;

            if (target.handler) {
                delete target.handler;

                if (!STATUS.running) {
                    index = runners.lastIndexOf(target);
                    if (index !== -1) {
                        runners.splice(index, 1);
                    }
                }
            }
        }

        if (!method(getter)) {
            throw new Error("Invalid [getter] Function parameter.");
        }

        if (!method(handler)) {
            throw new Error("Invalid [handler] Function parameter.");
        }

        callback.handler = handler;
        list[list.length] = callback;

        return stop;

    }

export
    function run() {
        var state = STATUS,
            runners = RUNNERS,
            asyncFlag = state.async;
    
        var c, runner, result, len, sideEffects, slen, toRemove, rlen;

        if (asyncFlag) {
            clearAsync(asyncFlag);
            state.async = false;
        }
    
        // if not yet running
        if (!state.running) {
            state.running = true;
            state.cycle = 2;
    
            sideEffects = [];
            toRemove = [];
            rlen = 0;
            slen = 0;
    
            mainLoop: for (; --state.cycle;) {
    
                // run compare
                len = runners.length;
                compareLoop: for (c = -1; len--;) {
                    runner = runners[++c];
    
                    // is deleted
                    if (!runner.handler) {
                        toRemove[rlen++] = c;
                        continue compareLoop;
                    }
                    
                    result = runner();
                    if (result) {
                        sideEffects[slen++] = runner;
                    }
                }
    
                // remove 
                len = rlen;
                for (; len--;) {
                    runners.splice(toRemove[len], 1);
                }
                toRemove.length = rlen = 0;
    
                // if no side effects, then just exit
                if (!slen) {
                    break mainLoop;
                }
    
                len = slen;
                sideEffectLoop: for (c = -1; len--;) {
                    runner = sideEffects[++c];
                    if (!runner.handler) {
                        toRemove[rlen++] = c;
                        continue sideEffectLoop;
                    }
                }
                sideEffects.length = slen = 0;
    
                // remove 
                len = rlen;
                for (; len--;) {
                    runners.splice(toRemove[len], 1);
                }
                toRemove.length = rlen = 0;
    
            }
    
            state.running = false;
            return true;
    
        }
    
        return false;
    }

export
    function runAsync() {
        var state = STATUS;

        if (!state.async) {
            state.async = setAsync(run);
        }
        
    }