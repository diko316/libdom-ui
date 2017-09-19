'use strict';

import {
            method
        } from "libcore";

const INVALID_SUPER_CLASS = "Invalid [superClass] parameter.";


export
    function isSubclassOf(SubClass, SuperClass) {
        var isMethod = method;

        if (!isMethod(SuperClass)) {
            throw new Error(INVALID_SUPER_CLASS);
        }

        if (isMethod(SubClass)) {
            return SubClass === SuperClass ||
                    SubClass.prototype instanceof SuperClass;
        }

        return SubClass instanceof SuperClass;
        
    }