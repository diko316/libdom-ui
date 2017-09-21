'use strict';

import {
            string,
            array,
            contains,
            createRegistry
        } from "libcore";

import { Packager } from "libcore-package-resolver";

import { elementRoles as domElementRoles } from "./helper/roles.js";

import { isSubclassOf } from "./helper/class.js";

import Base from "control/base.js";

const INVALID_NAME = "Invalid Control [role] parameter.",
        INVALID_CLASS = "Invalid Control [Class] parameter.",
        REGISTRY = createRegistry(),
        CONTROLS = new Packager();

export
    function register(role, Class, dependencies) {
        var isString = string,
            registry = REGISTRY;
        var l, item;

        if (string(role)) {
            throw new Error(INVALID_NAME);
        }
        else if (registry.exists(role)) {
            throw new Error(`Unable to register an existing Role "${role}"!`);
        }

        if (!isSubclassOf(Class, Base)) {
            throw new Error(INVALID_CLASS);
        }

        if (array(dependencies)) {
            dependencies = dependencies.slice(0);
            for (l = dependencies; l--;) {
                item = dependencies[l];
                if (!isString(item)) {
                    dependencies.splice(l, 1);
                    continue;
                }

            }

            CONTROLS.register(role, dependencies);

        }
        else {

            CONTROLS.register(role);
        }

        registry.set(role, Class);
    }

export
    function exists(names) {
        return CONTROLS.exists(names);
    }

export
    function elementRoles(dom) {
        var manager = CONTROLS,
            roles = domElementRoles(dom);
        var len;

        // filter
        if (array(roles)) {
            for (len = roles.length; len--;) {
                if (!manager.exists(roles[len])) {
                    roles.splice(len, 1);
                }
            }

            if (roles.length) {
                return manager.flatten(roles);
            }

        }

        return [];
    }

export
    function instantiate(role, node) {
        var registry = REGISTRY;
        var Class;

        if (!string(role) || !registry.exists(role)) {
            return null;
        }

        Class = registry.get(role);

        return new Class(node);
        

    }
