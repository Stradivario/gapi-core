import { GapiModuleArguments } from "./gapi-module.decorator.interface";
import 'reflect-metadata';
export declare function GapiModule<T, K extends keyof T>(options: GapiModuleArguments): (target: any) => any;