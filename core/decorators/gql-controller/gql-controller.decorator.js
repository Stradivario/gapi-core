"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
class TestenClass2 {
    constructor() {
        // console.log(this);
    }
    get() {
        console.log('get');
    }
    set() {
    }
}
exports.TestenClass2 = TestenClass2;
function GapiController(options) {
    return (target) => {
        const original = target;
        function construct(constructor, args) {
            const c = function () {
                // this.testenClass2 = new TestenClass2();
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        const f = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        console.log(f.prototype);
        // Reflect.defineMetadata(GapiControllerSymbol, options, f);
        return f;
    };
}
exports.GapiController = GapiController;
