export declare function Query<T>(options?: {
    [key: string]: {
        [key: string]: any;
    };
}): (target: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
