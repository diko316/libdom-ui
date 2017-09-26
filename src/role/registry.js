'use strict';


import {
            string,
            method,
            array,
            createRegistry
        } from "libcore";

import { Packager } from "libcore-package-resolver";

import { generate } from "./hash.js";

import BaseControl from "./base.js";


const   INVALID_NAME = "Invalid Control [role] parameter.",
        INVALID_MIXIN = "Invalid Control [mixin] parameter.",
        CLASS_REGISTRY = createRegistry(),
        REGISTRY = createRegistry(),
        DEPENDENCIES = new Packager();

export
    function resolve(roles, ignoreInvalid) {
        var isString = string,
            registry = REGISTRY;
        var l, total, role;

        if (isString(roles)) {
            roles = [roles];
        }

        if (array(roles)) {
            total = roles.length;

            ignoreInvalid = ignoreInvalid !== false;

            for (l = total; l--;) {
                role = roles[l];
                if (!isString(role) || !registry.exists(role)) {
                    if (ignoreInvalid) {
                        roles.splice(l, 1);
                        total--;
                        continue;
                    }
                    return false;
                }
            }

            if (total) {
                return DEPENDENCIES.flatten(roles);
            }
            
        }

        return false;
    }

export
    function register(role, mixin, dependencies) {
        var registry = REGISTRY,
            isString = string,
            requires = DEPENDENCIES,
            noDependencies = true;
        var l, total, len;

        // allow array of arguments registration
        if (array(role)) {
            len = role.length;
            dependencies = len > 2 ? role[2] : null;
            mixin = len > 1 ? role[1] : null;
            role = role[0];
        }

        if (!isString(role)) {
            throw new Error(INVALID_NAME);
        }
        else if (registry.exists(role)) {
            throw new Error(`Unable to register an existing Role "${role}"!`);
        }

        if (!method(mixin)) {
            throw new Error(INVALID_MIXIN);
        }

        // validate dependencies
        if (array(dependencies)) {
            total = dependencies.length;
            for (l = total; l--;) {
                if (!isString(dependencies[l])) {
                    throw new Error("Invalid [dependencies] parameter.");
                }
            }
            if (total) {
                noDependencies = false;
            }
        }

        if (noDependencies) {
            requires.register(role);
        }
        else {
            requires.register(role, dependencies.slice(0));
        }

        registry.set(role, mixin);
    }

export
    function getClass(roles) {
        var Base = BaseControl,
            Class = Base,
            isClass = method,
            classRegistry = CLASS_REGISTRY,
            registry = REGISTRY;
        var c, l, id, role;
        
        roles = resolve(roles);
        if (!roles) {
            throw new Error("Invalid [roles] parameter.");
        }

        if (roles.length) {
            id = generate(roles);

            // found!
            if (classRegistry.exists(id)) {
                
                return classRegistry.get(id);

            }
            
            // create
            for (c = -1, l = roles.length; l--;) {
                role = roles[++c];
                if (!registry.exists(role)) {
                    throw new Error(`${role} [roles] item is not registered`);
                }

                // run mixin
                Class = registry.get(role)(Class);

                if (!isClass(Class)) {
                    throw new Error(`${role} Role creates invalid mixin.`);
                }

            }

            classRegistry.set(id, Class);

        }

        return Class;

    }