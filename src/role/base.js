'use strict';

import { clear } from "libcore";

export default
    class BaseControl {
        constructor(node) {
            this.alive = true;
            this.node = node;
            node.control = this;
        }

        onDestroy() {
            var node = this.node;
            
            if (node) {
                node.control = null;
            }

        }

        initialize() {

        }

        mount() {
            
        }

        unmount() {

        }

        destroy() {
            if (this.alive) {
                this.alive = false;
                this.onDestroy();
                clear(this);
            }
            return this;
        }
    }