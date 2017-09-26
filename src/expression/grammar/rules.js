'use strict';

const rules = [

    "Expr", [
        /\?/
    ],



////////////////////////////////////// scalar    
    "Number", [
        /(\+|\-)?[0-9]+(\.[0-9]+)?/
    ],

    "String", [
        /\"([^\"]|\\\")*\"/,
        /\'([^\']|\\\')*\'/
    ]

];

export default rules;