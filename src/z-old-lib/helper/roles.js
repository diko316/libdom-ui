'use strict';

import {
            string,
            trim,
            unionList
        } from "libcore";

const ATTR_SPLIT_RE = /\s+/;


export
    function parseRoles(subject) {
        var roles;
        
        if (string(subject)) {
            subject = trim(subject);
            
            if (subject) {
                roles = subject.split(ATTR_SPLIT_RE);
                return unionList(roles, []);
            }
        }

        return [];
    }

export
    function elementRoles(element) {
        return parseRoles(element.getAttribute('lib:role'));
    }

