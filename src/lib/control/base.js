'use strict';

export default
    class BaseControl {
        constructor(node, name) {
            var O = Object;

            O.defineProperty(this,
                            '$',
                            {
                                enumerable: false,
                                writable: false,
                                configurable: true,
                                value: node
                            });

            O.defineProperty(this,
                            'name',
                            {
                                enumerable: false,
                                writable: false,
                                configurable: false,
                                value: name
                            });
        }
    }