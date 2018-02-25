import 'reflect-metadata';
import { GapiControllerArguments } from "./gql-controller.decorator.interface";
export declare class TestenClass2 {
    constructor();
    get(): void;
    set(): void;
}
export declare function GapiController(options?: GapiControllerArguments): (target: any) => any;
