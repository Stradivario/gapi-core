import { GapiModuleArguments } from "./gql-module.decorator.interface";
import 'reflect-metadata';
export declare function GapiModule<T, K extends keyof T>(options: GapiModuleArguments): (target: Function) => any;
