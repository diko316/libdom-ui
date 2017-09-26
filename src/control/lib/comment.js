'use strict';


const   dependencies = ['lib-dom', 'lib-stateful'],
        mixin = (Base) => {
    
            class Comment extends Base {


                // initialize() {
                //     // register to parent node if this contains text node
                //     super.initialize();
                // }


                mount(dom) {

                    var textNode = dom.ownerDocument.createTextNode('');

                    // insert marker
                    dom.parentNode.insertBefore(textNode, dom);
                    this.domText = textNode;
                    textNode = null;


                    super.mount(dom);
                }

                unmount() {
                    var dom = this.dom;

                    dom.parentNode.removeChild(this.domText);
                    dom = this.domText = null;

                    super.unmount();
                }


        
            }
        
            return Comment;
        
        }; 

export default ['lib-comment',
                mixin,
                dependencies];