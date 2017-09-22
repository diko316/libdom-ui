'use strict';


import { string } from "libcore";

const   GEN_ROW_MAX = 0xFFFFFF,
        GEN_MAX_STRING = GEN_ROW_MAX.toString(36);

var GEN_ROW = 0,
    GEN_CELL = GEN_ROW_MAX;

export
    function generate(prefix) {
        var max = GEN_ROW_MAX,
            current = --GEN_CELL,
            lead = GEN_ROW,
            generated = [],
            gl = 0;

        if (string(prefix)) {
            generated[gl++] = prefix; 
        }

        if (!current) {
            GEN_CELL = max;
            GEN_ROW++;
        }

        for (; lead--;) {
            generated[gl++] = GEN_MAX_STRING;
        }

        generated[gl++] = (max - current).toString(36);

        return generated.join('');

    }