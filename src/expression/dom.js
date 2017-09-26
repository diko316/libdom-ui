'use strict';

import { is } from "libdom";

import {
            string,
            trim
        } from "libcore";

const   EXPRESSION_RE = /^\?[a-z]+(\-[a-z]+)*\s+.+\?$/gi;


export
    function domAttributeExpression(element, name) {

        if (is(element, 1) && string(name)) {
            return getExpression(element.getAttribute(name));
        }

        return null;
    }

export
    function domCommentExpression(comment) {
        if (is(comment, 8)) {
            return getExpression(comment.nodeValue);
        }
        return null;
    }

export
    function getExpression(value) {
        if (string(value)) {
            value = trim(value);
            if (EXPRESSION_RE.test(value)) {
                return value.substring(1, value.length - 1);
            }
        }
        return null;
    }
