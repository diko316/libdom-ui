'use strict';


export default
    class Control {
        constructor(node) {
            Object.defineProperty(this,
                                '$',
                                {
                                    enumerable: false,
                                    writable: false,
                                    configurable: true,
                                    value: node
                                });
        }
    }