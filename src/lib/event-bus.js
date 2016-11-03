'use strict';

var LIBDOM = require("libdom"),
    LIBCORE = require("libcore"),
    EVENT_NAME = 'buspublish';

function create() {
    return new EventBus();
}

function createStringFilter(bus, string, handler) {
    function onEvent(event) {
        var message = event.busmessage;
        if (message[0] === bus && message[1] === string) {
            handler(message[1], message[2]);
        }
    }
    return onEvent;
}

function createRegExpFilter(bus, regex, handler) {
    function onEvent(event) {
        var message = event.busmessage;
        if (message[0] === bus && regex.test(message[1])) {
            handler(message[1], message[2]);
        }
    }
    return onEvent;
}

function setListener(bus, listener, unsubscribe) {
    
    listener.item = unsubscribe;
    listener.before = null;
    listener.next = bus.subscriptions;
    
    bus.subscriptions = listener;
    
}

function unsetListener(bus, listener) {
    var current = bus.subscriptions,
        before = listener.before,
        after = listener.next;
    
    
    if (before) {
        before.next = after;
    }
    
    if (after) {
        after.before = before;
    }
    
    if (current === listener) {
        bus.subscriptions = before || after;
    }
    
    delete listener.item;
    delete listener.next;
    delete listener.before;
}



function EventBus() {
    this.queue = [];
}

EventBus.prototype = {
    subscriptions: null,
    queue: void(0),
    publishing: false,
    publish: function (event, message) {
        var me = this,
            CORE = LIBCORE,
            DOM = LIBDOM;
        var list, item, dispatch, target, eventName;
            
        if (CORE.string(event) && CORE.object(message)) {
            target = global.document;
            eventName = EVENT_NAME;
            list = me.queue;
            list[list.length] = [me, event, message];
            
            if (!me.publishing) {
                me.publishing = true;
                dispatch = DOM.dispatch;
                
                for (; list.length;) {
                    item = list[0];
                    list.splice(0, 1);
                    dispatch(target, eventName, {
                        busmessage: item,
                        bubbles: false
                    });
                }
                me.publishing = false;
            }
            target = dispatch = list = item = null;
        }
        
        return me;
    },
    
    subscribe: function (filter, handler) {
        var me = this,
            CORE = LIBCORE,
            DOM = LIBDOM,
            G = global,
            eventName = EVENT_NAME,
            isString = CORE.string(filter),
            listener = null;
        
        function unsubscribe() {
            if (listener) {
                DOM.un(G.document, eventName, listener);
                unsetListener(me, listener);
                listener = null;
            }
        }
        
        
        if (filter instanceof RegExp || isString) {
            DOM.on(G.document,
                    eventName,
                    listener = isString ?
                            createStringFilter(me, filter, handler) :
                            createRegExpFilter(me, filter, handler));
            
            setListener(me, listener, unsubscribe);
        }
        
        return unsubscribe;
        
    },
    
    clear: function () {
        var me = this,
            current = me.subscriptions;
        var next;
        
        for (; current; current = next) {
            next = current.next;
            current.item();
        }
        
        return this;
    }
};


module.exports = {
    create: create,
    bus: create()
};