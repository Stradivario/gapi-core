import 'reflect-metadata';
import { GapiControllerArguments } from "./gql-controller.decorator.interface";
import { GapiControllerSymbol } from './gql-controller.symbol';
import Container from 'typedi';
export class TestenClass2 {
    constructor() {
        // console.log(this);
    }
    get() {
        console.log('get');
    }

    set() {

    }
}
export function GapiController(options?: GapiControllerArguments) {
    return (target: any) => {
        const original = target;
        function construct(constructor, args) {
            const c: any = function () {
                // this.testenClass2 = new TestenClass2();
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        const f: any = function (...args) {
            console.log('Loaded Module: ' + original.name);
            return construct(original, args);
        };
        f.prototype = original.prototype;
        console.log(f.prototype);
        // Reflect.defineMetadata(GapiControllerSymbol, options, f);
        return f;
    };
}