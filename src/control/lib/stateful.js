'use strict';

const   mixin = (Base) => {

    class Stateful extends Base {

        initialize() {
            var node = this.node,
                parent = node.parent;


            node.state = createState(parent ?
                                        parent.state : null);

            super.initialize();

        }

    }

    return Stateful;

};

function empty() {
}

function createState(from) {
    var E = empty,
        Class = State;

    if (from) {
        E.prototype = from;
        Class = E;
    }

    return new Class();
}

class State {

}

export default ['lib-stateful', mixin];