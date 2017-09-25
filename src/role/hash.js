'use strict';

const   STATE_MAP = {
            start: {}
        },
        ENDS = {};

var ID_GEN = 0;

export
    function generate(list) {
        var map = STATE_MAP,
            gen = ID_GEN,
            ends = ENDS,
            state = map.start,
            c = -1,
            l = list.length,
            target = null;
        var name, access, resolveId;

        for (; l--;) {
            name = list[++c];
            access = ':' + name;
            if (access in state) {
                target = state[access];
            }
            else {
                state[access] = 
                target = 's' + (++gen);
                map[target] = {};
            }
            state = map[target];
        }

        ID_GEN = gen;

        if (target && !(target in ends)) {
            ends[target] = true;
        }

        return target;
    }
