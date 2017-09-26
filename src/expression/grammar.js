'use strict';

const   root = "Expr",
        ignore = [/[ \r\n\t]+/],
        rules = [

    "Expr", [
        "Test", /\?/
    ],

    "Test", [
        /\$\$\$/
    ],



];

export {
            root,
            ignore,
            rules
        };


