'use strict';


describe('test',
    () => {
        var lib = global.everything;
        var packager;

        beforeEach(() => {
            packager = new (lib.Packager)();

            packager.register('main', ['r2', 'r5']);

            packager.register('r2', ['r3', 'r4']);

            packager.register('r3');

            packager.register('r4');

            packager.register('r5', ['main']);

        });

        it(`run this!`,
        () => {

            expect(() => packager.flatten(['main'])).not.toThrow();

        });

    });