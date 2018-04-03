import { ServiceOptions } from '../types/ServiceOptions';
import { Token } from '../Token';
export declare function GapiEffect<T, K extends keyof T>(optionsOrServiceName?: ServiceOptions<T, K> | Token<any> | string): Function;
