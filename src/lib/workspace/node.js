'use strict';

import State from "./state.js";

import {
            clear
        } from "libcore";

class Node {

    constructor() {
        this.attribute = {};
        this.cache = {};
        this.state = new State(this);
        this.alive = true;

        this.dom =
            this.root =
            this.parent =
            this.first =
            this.last =
            this.previous =
            this.next = null;

    }


    onDestroy() {
        var clearObject = clear;

        // unset child
        this.dom =
            this.root =
            this.parent =
            this.first =
            this.last =
            this.previous =
            this.next = null;

        clearObject(this.cache);
        clearObject(this);
    }

    destroy() {
        if (this.alive) {
            this.onDestroy();
        }
    }


}




export default Node;
