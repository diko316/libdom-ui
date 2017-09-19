'use strict';


export default
    class BaseControl {
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