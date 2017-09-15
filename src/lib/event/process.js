'use strict';

import {
            setAsync,
            middleware
        } from "libcore";

import {
            on,
            destructor
        } from "libdom";


var HANDLERS = [],
    RUN_SESSION = null,
    RUN_ON_START = false,
    EVENT_MIDDLEWARE = middleware('libdom.event'),
    RUN_NO_MORE = false,
    STATUS = {
        debug: false,
        running: false,
        ready: false
    };

function onDOMEventDispatch() {
    console.log("dom event dispatched");
    if (!RUN_SESSION) {
        run();
    }
}

function onDOMReady() {
    var status = STATUS;
    
    if (!status.ready) {
        status.ready = true;
        if (RUN_ON_START) {
            setAsync(run);
        }
    }
    
}

// add libdom event middleware register
EVENT_MIDDLEWARE.register('dispatch', onDOMEventDispatch);
on(global.window, 'load', onDOMReady);



// stop event all loops
destructor(() => stop());


export {
        STATUS as state
    };

export
    function register(handler, scope) {
        var handlers = HANDLERS,
            currentlyRunning = RUN_SESSION,
            index = handlers.length,
            removed = false,
            context = scope;
        var queue;

        function run() {
            if (!removed) {
                try {
                    handler.apply(context, arguments);
                }
                catch (e) {
                    if (STATUS.debug) {
                        console.warn(e);
                    }
                }
            }
        }

        function unregister() {
            var list = handlers,
                target = run;
            var index;

            if (removed) {
                return;
            }

            removed = true;

            index = list.indexOf(target);
            if (index !== -1) {
                list.splice(index, 1);
            }

            context = null;

        }

        handlers[index] = run;
        context = scope === undefined ? null : scope;

        // enqueue if there is currently running instance
        if (currentlyRunning) {
            queue = currentlyRunning.queue;
            queue[queue.length] = run;
        }

        return unregister;
    }

export
    function run(forceQueue) {
        var current = RUN_SESSION,
            started = !!current,
            list = HANDLERS;
        var total, c, l, queue;

        // do not run if already destroyed
        if (RUN_NO_MORE) {
            return;

        // do not run if not ready
        }
        else if (!STATUS.ready) {
            RUN_ON_START = true;
            return;

        }
        // do not run if already running. but, queue another iteration
        else if (started) {
            if (forceQueue === true) {
                current.iterations++;
            }
            return;
        }

        RUN_SESSION = current = {
            stop: false,
            iterations: 1,
            queue: queue = list.slice(0)
        };

        total = queue.length;

        for (; total;) {
            c = -1;

            for (; l--;) {
                queue[++c]();
            }

            // remove
            queue.splice(0, total);
            total = queue.length;

            // full stop
            if (current.stop) {
                queue.splice(0, queue.length);
                total = 0;
            }
            else if (!total && current.iterations--) {
                total = list.length;
                queue.push.apply(queue, list);
            }
            
        }

        RUN_SESSION = null;
        
    }

export
    function stop() {
        var current = RUN_SESSION;

        if (current) {
            current.stop = true;
        }
    }