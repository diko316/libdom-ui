'use strict';

import {
            string,
            array,
            contains,
            createRegistry
        } from "libcore";

import { isSubclassOf } from "./helper/class.js";

import Base from "control/base.js";

const REGISTRY = createRegistry(),
        INVALID_NAME = "Invalid Control [role] parameter.",
        INVALID_CLASS = "Invalid Control [Class] parameter.",
        DEPENDENCIES = {};

function resolveDependencies(roles) {
    var has = contains,
        registry = REGISTRY,
        cache = DEPENDENCIES,
        c = -1,
        l = roles.length,
        resolved = [],
        ul = 0;
    var role, dl;

    for (; l--;) {
        role = roles[++c];
        
        if (has(cache, role)) {
            continue;
        }
        else if (!registry.exists(role)) {
            throw new Error(`Role ${role} do not exist.`);
        }

    }

}

export
    function register(role, Class, dependencies) {
        var isString = string,
            registry = REGISTRY,
            cache = DEPENDENCIES,
            has = contains;
        var l, item, inside;

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

        }

        registry.set(role, Class);
    }

export
    function instantiate(node, roles) {
        roles = resolveDependencies(roles);
    }