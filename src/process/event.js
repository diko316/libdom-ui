'use strict';

import {
            setAsync,
            middleware,
            array
        } from "libcore";

import {
            on,
            destructor
        } from "libdom";


var HANDLERS = [],
    UNREGISTERS = [],
    RUN_SESSION = null,
    RUN_ON_START = false,
    EVENT_MIDDLEWARE = middleware('libdom.event'),
    STATUS = {
        debug: false,
        running: false,
        ready: false,
        ended: false
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

function onSessionEnd() {
    var list = UNREGISTERS;
    var l;

    stop();
    for (; l--;) {
        list[l]();
    }
}

// add libdom event middleware register
EVENT_MIDDLEWARE.register('dispatch', onDOMEventDispatch);
on(global.window, 'load', onDOMReady);



// stop event all loops
destructor(onSessionEnd);


export {
        STATUS as state
    };

export
    function register(handler, scope, args) {
        var handlers = HANDLERS,
            currentlyRunning = RUN_SESSION,
            index = handlers.length,
            removed = false,
            context = scope;
        var queue;

        function run() {
            if (removed) {
                return;
            }
            
            try {
                return handler.apply(context, args);
            }
            catch (e) {
                if (STATUS.debug) {
                    console.warn(e);
                }
            }
            return true;
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
                UNREGISTERS.splice(index, 1);
            }

            args.splice(0, args.length);
            args = context = null;

        }
        args = array(args) ? args.slice(0) : [];
        handlers[index] = run;
        UNREGISTERS[index] = unregister;
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
            list = HANDLERS,
            status = STATUS;
        var total, c, l, queue;

        // do not run if already destroyed
        if (status.ended) {
            return;

        // do not run if not ready
        }
        else if (!status.ready) {
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

        main: for (; total;) {
            c = -1;

            for (; l--;) {
                queue[++c]();
                if (status.ended) {
                    stop();
                    break main;
                }
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
        var queue;

        if (current) {
            current.stop = true;
            
            queue = current.queue;
            queue.splice(0, queue.length);
            RUN_SESSION = null;
        }
    }