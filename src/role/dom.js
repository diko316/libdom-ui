'use strict';



import { string } from "libcore";

import { is } from "libdom";

import {
            getClass,
            resolve
        } from "./registry.js";

import { domCommentExpression } from "../expression/dom.js";


const   ROLE_ATTRIBUTE_NAME = 'ui:role',
        INVALID_DOM = "Invalid [dom] element parameter.",
        SPLIT_RE = /\s+/,
        EXPRESSION_COMMENT_RE = /^\?[a-z\_]+(\-[\_a-z]+)*\s+.+\s*\?$/ig;



function isExpressionComment(dom) {
    return EXPRESSION_COMMENT_RE.test(dom.nodeValue);
}

export
    function elementRoles(dom) {
        var roles;

        if (!is(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        roles = dom.getAttribute(ROLE_ATTRIBUTE_NAME);

        if (string(roles)) {
            roles = resolve(roles.split(SPLIT_RE), true);
            if (roles) {
                return roles;
            }
        }

        return null;
    }

export
    function link(node, roles) {
        var Class = getClass(roles),
            instance = null;

        if (Class) {
            instance = new Class(node);
        }
        
        return instance;
    }

export
    function compile(parent, dom) {
        var isDom = is,
            getRoles = elementRoles,
            isCommentNode = isExpressionComment;
        var current, roles, node, root, depth;

        if (!isDom(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        root = parent.nodeType === 9 ? parent : parent.root;

        depth = 0;

        // bind descendants
        loop: for (current = dom; current;) {
            node = null;

            switch (current.nodeType) {
            case 1:
                if (depth) {
                    roles = getRoles(current);
                    if (roles) {
                        node = root.createElement();
                        parent.add(node);
                        node.link(current, roles);
                    }
                }

                // go inside
                if (!node) {
                    node = current.firstChild;
                    if (node) {
                        depth++;
                        current = node;
                        continue loop;
                    }
                }
                break;

            // case 3:
            //     node = root.createTextNode();
            //     parent.add(node);
            //     node.link(current);
            //     break;

            case 8:
                
                if (domCommentExpression(current)) {
                    node = root.createComment();
                    parent.add(node);
                    node.link(current);
                }
            }

            // go to next node
            node = current.nextSibling;
            
            for (; !node && depth-- && current;) {
                current = current.parentNode;
                node = current.nextSibling;
            }

            current = node;

        }
        

        return parent;

    }