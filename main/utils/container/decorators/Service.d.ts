import { ServiceOptions } from "../types/ServiceOptions";
import { Token } from "../Token";
/**
 * Marks class as a service that can be injected using Container.
 */
export declare function Service(): Function;
/**
 * Marks class as a service that can be injected using Container.
 */
export declare function Service(name: string): Function;
/**
 * Marks class as a service that can be injected using Container.
 */
export declare function Service(token: Token<any>): Function;
/**
 * Marks class as a service that can be injected using Container.
 */
export declare function Service<T, K extends keyof T>(options?: ServiceOptions<T, K>): Function;
