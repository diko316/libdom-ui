'use strict';

import * as API from "./api.js";

global.libui = API;

export * from "./api.js";

export default API;




// test

// import Tokenizer from "libcore-tokenizer";

// var tokenizer = new Tokenizer();


// tokenizer.define([

//      "string",
//         /\"([^\"]|\\\")*\"/,
//         /\'([^\']|\\\')*\'/
    
// ]);

// global.tokenizer = tokenizer;
// console.log(tokenizer);