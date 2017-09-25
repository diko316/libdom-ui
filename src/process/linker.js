'use strict';

import { string } from "libcore";

import { is } from "libdom";

import Document from "../virtual/document.js";

import {
            getClass,
            resolve as resolveRoles
        } from "../role/registry.js";

const   ROLE_ATTRIBUTE_NAME = 'ui:role',
        INVALID_DOM = "Invalid [dom] element parameter.",
        SPLIT_RE = /\s+/;

function getElementRoles(dom) {
    var roles;

    if (!is(dom, 1)) {
        throw new Error(INVALID_DOM);
    }

    roles = dom.getAttribute(ROLE_ATTRIBUTE_NAME);

    if (string(roles)) {
        roles = resolveRoles(roles.split(SPLIT_RE), true);
        if (roles) {
            return roles;
        }
    }

    return null;
}

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
            linkControl = link,
            getRoles = getElementRoles;
        var current, roles, node, root, depth;

        if (!isDom(dom, 1)) {
            throw new Error(INVALID_DOM);
        }

        root = parent instanceof Document ? parent : parent.root;

        depth = 0;

        // bind descendants
        for (current = dom; current;) {

            if (current.nodeType === 1) {
                node = null;

                if (depth) {
                    roles = getRoles(dom);
                    if (roles) {
                        node = root.createNode(1);
                        parent.add(node);
                        node.link(dom);
                        linkControl(node, roles).
                            mount(dom);
                    }
                }

                // go inside
                if (!node) {
                    node = current.firstChild;
                    if (node) {
                        depth++;
                        current = node;
                        continue;
                    }
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


export
    function createContext(documentNode) {
        var instance;

        if (!is(documentNode, 9)) {
            throw new Error("Invalid [documentNode] element parameter.");
        }

        instance = new Document();

        link(instance, 'document').
            mount(documentNode);

        compile(instance, documentNode.documentElement);

        return instance;
        
    }