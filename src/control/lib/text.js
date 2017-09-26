'use strict';


const   dependencies = ['lib-dom'],
        mixin = (Base) => {
    
            class Text extends Base {


                initialize() {
                    
                    // register to parent node if this contains text node


                    super.initialize();
                }


                // mount(dom) {

                //     var marker = dom.ownerDocument.
                //                     createComment('for="' +
                //                                     this.node.objectId +
                //                                     '"'),
                //         parent = dom.parentNode;

                //     // insert marker
                //     parent.replaceChild(marker, dom);
                //     parent.insertBefore(dom, marker);


                //     return super.mount(dom);
                // }


        
            }
        
            return Text;
        
        }; 

export default ['lib-text', mixin, dependencies];