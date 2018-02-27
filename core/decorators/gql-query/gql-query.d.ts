export declare function Query<T>(options?: {
    [key: string]: {
        [key: string]: any;
    };
}): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
