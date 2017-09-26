'use strict';


const   dependencies = ['lib-dom'],
        mixin = (Base) => {
    
            class Document extends Base {

            }

            return Document;

        };

export default ['lib-document',
                mixin,
                dependencies];