'use strict';

import { on } from "libdom";

import {
            register,
            run
        } from "./index.js";


register(() => {
    console.log("check check");
});

on(global.document.body, "click", () => {
    console.log("clicked");
});