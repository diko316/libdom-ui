'use strict';

import {
            string,
            array
        } from "libcore";

const INVALID_NAME = "Invalid Package [name] parameter.",  
    INVALID_NAMES = "Invalid [names] Package collection parameter.";


class Package {
    constructor(name) {
        this.id = ':' + name;
        this.name = name;
        
        this.registered = false;
        this.requires = [];

    }
}


export default
    class Packager {
        constructor() {
            this.names = [];
            this.packages = {};
        }

        register(name, dependencies) {

            var isString = string,
                names = this.names,
                list = this.packages,
                PackageClass = Package;
            var c, l, dependency, items, il, id, packageObject;
            
            if (!isString(name)) {
                throw new Error(INVALID_NAME);
            }

            id = ':' + name;

            if (id in list && list[id].registered) {
                throw new Error(`Package ${name} already exists.`);
            }

            names[names.length] = name;

            packageObject = new PackageClass(name);
            
            list[id] = packageObject;
            packageObject.registered = true;
            

            if (isString(dependencies)) {
                dependencies = [dependencies];
            }

            if (array(dependencies)) {
                items = packageObject.requires;
                il = 0;

                for (c = -1, l = dependencies.length; l--;) {
                    dependency = dependencies[++c];
                    if (isString(dependency)) {
                        items[il++] = dependency;
                    }

                }

            }

            return this;

        }

        flatten(names) {
            var list = this.packages,
                isString = string;
            var position, len, name, id, inserted, stack, total,
                pack, requires, resolved, rl;

            if (isString(names)) {
                names = [names];
            }

            if (array(names)) {
                total = names.length;

                // validate names
                for (len = total; len--;) {
                    name = names[len];

                    if (!isString(name)) {
                        throw new Error(INVALID_NAMES);
                    }

                    id = ':' + name;
                    if (!(id in list)) {
                        throw new Error(`Package ${name} do not exist.`);
                    }
                    else if (!list[id].registered) {
                        throw new Error(`Package ${name} is not registered.`);
                    }

                }

                inserted = {};
                stack = null;
                position = -1;
                len = total;
                resolved = [];
                rl = 0;

                for (; len--;) {
                    name = names[++position];
                    id = ':' + name;
                    pack = list[id];

                    requires = pack.requires;
                    total = requires.length;
                    
                    // should recurse
                    if (total) {
                        stack = {
                            parent: stack,
                            ender: name,
                            c: position,
                            l: len,
                            items: names,
                            rs: resolved
                        };
                        names = requires;
                        len = total;
                        position = -1;
                        continue;
                    }

                    // leaf
                    if (!(id in inserted)) {
                        resolved[rl++] =
                            inserted[id] = name;
                    }

                    // end?
                    if (!len) {
                        // pop
                        for (; stack; stack = stack.parent) {
                            len = stack.l;
                            name = stack.ender;

                            // included ender
                            resolved[rl++] = 
                                inserted[':' + name] = name;

                            // break to continue
                            if (len) {
                                position = stack.c;
                                names = stack.rs;
                                names.push.apply(names, resolved);
                                resolved = names;
                                names = stack.items;
                                rl = resolved.length;
                                break;

                            }

                        }

                    }


                }



            }

            

        }
    }