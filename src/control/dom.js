'use strict';




export default (Base) => {

    class Dom extends Base {

        mount(dom) {
            this.dom = dom;

            return super.mount(dom);
        }

        unmount(dom) {
            var result = super.unmount(dom);

            delete this.dom;

            return result;
        }

    }

    return Dom;

};