'use strict';


const   dependencies = ['lib-stateful'],
        mixin = (Base) => {
    
    class Dom extends Base {

        onDestroy() {

            if (this.dom) {
                this.unmount();
            }

            super.onDestroy();
        }

        mount(dom) {
            this.dom = dom;

            return super.mount(dom);
        }

        unmount() {
            var result = super.unmount();

            this.dom = null;

            return result;
        }


    }

    return Dom;

};

export default ['lib-dom',
                mixin,
                dependencies];
