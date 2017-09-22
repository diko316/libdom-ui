'use strict';

import {
            string,
            unionList
        } from "libcore";

import { is } from "libdom";

const ATTR_SPLIT_RE = /\s+/;


export
    function parseRoles(subject) {
        var roles;
        
        if (string(subject)) {
            roles = subject.split(ATTR_SPLIT_RE);
            return unionList(roles, []);
        }

        return [];
    }

export
    function elementRoles(element) {
        return parseRoles(element.getAttribute('lib:role'));
    }

