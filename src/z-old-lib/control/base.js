'use strict';


export default
    class BaseControl {
        constructor(node, role, name) {
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
                            'role',
                            {
                                enumerable: false,
                                writable: false,
                                configurable: false,
                                value: role
                            });

            O.defineProperty(this,
                            'name',
                            {
                                enumerable: false,
                                writable: false,
                                configurable: false,
                                value: name
                            });
            
            this.applyRoleAria = false;
        }

        initialize() {

        }

        prepare() {
            // return a promise before calling prepare
        }

        mount() {

        }

        unmount() {

        }


        destroy() {

        }


        // easy access methods
        

    }