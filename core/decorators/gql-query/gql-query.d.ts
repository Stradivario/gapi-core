export declare function Query<T>(options?: any): (t: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export declare function Logger(): (object: Object, propertyName: string, index?: number) => void;
export interface LoggerInterface {
    log(message: string): void;
}
export declare class ConsoleLogger implements LoggerInterface {
    log(message: string): void;
}
