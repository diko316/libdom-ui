'use strict';

var dom = require("libdom"),
    main = dom.ui,
    bus = main.bus;
    
    
bus.subscribe('test',
    function () {
        console.log('message ', arguments);
    });


bus.subscribe(/any|basta/,
    function () {
        console.log('/any|basta/ ', arguments);
    });




dom.on(global.document, 'click',
    function () {
        console.log('publishing test');
        bus.publish('test', { label: 'a message' });
        bus.publish('anything', { label: 'anything' });
        bus.publish('anywhere', { label: 'anywhere' });
        bus.publish('basta', { label: 'basta' });
    });


dom.on(global.document, 'contextmenu',
    function () {
        bus.clear();
    });