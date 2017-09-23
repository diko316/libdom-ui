'use strict';


import {
            string,
            contains
        } from "libcore";

const   DEFAULT_PREFIX = "default",
        GEN_ROW_MAX = 0xFFFFFF,
        GEN_MAX_STRING = GEN_ROW_MAX.toString(36),
        BY_PREFIX = {};

export
    function generate(prefix) {
        var max = GEN_ROW_MAX,
            list = BY_PREFIX;
        var store, current, counterPrefix;

        if (!string(prefix)) {
            prefix = DEFAULT_PREFIX;
        }

        if (!contains(list, prefix)) {
            list[prefix] = store = [0, max, ''];
        }
        else {
            store = list[prefix];
        }

        counterPrefix = store[2];
        current = --store[1];
        if (!current) {
            store[2] += GEN_MAX_STRING;
            store[1] = max;
            store[0]++;
        }

        return prefix + counterPrefix + (max - current).toString(36);

    }
