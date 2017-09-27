'use strict';

import { string } from "libcore";


class Context {

}

function empty() {

}

export
    function create(from) {
        var Class = Context;

        if (from instanceof Class) {
            Class = empty;
            empty.prototype = from;
        }

        return new Class();
    }


export
    function set(name, value) {
        var Prototype = Context.prototype;

        if (string(name)) {
            Prototype[name] = value;
        }
    }