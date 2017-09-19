'use strict';

export default
    class State {
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