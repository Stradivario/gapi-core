import 'reflect-metadata';
import { GapiModuleArguments } from './gapi-module.decorator.interface';
export declare function GapiModule<T, K extends keyof T>(module?: GapiModuleArguments): (target: any) => any;
