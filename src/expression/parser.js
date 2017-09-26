'use strict';


import { define } from "libcore-parser-lalr";

import {
            rules,
            ignore,
            root
        }  from "./grammar.js";


const   PARSER = define(root,
                        rules,
                        ignore);