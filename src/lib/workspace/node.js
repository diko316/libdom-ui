'use strict';

import Control from "./control.js";
import {
            clear
        } from "libcore";

class Node {

    constructor() {
        this.attribute = {};
        this.cache = {};
        this.state = new Control(this);
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
