import {Container} from "../../utils/container";

export function Injector<T>(Service: T): Function {
    return function(target: Object, propertyName: string, index?: number) {
        const service: T = Container.get<T>(Service);
        target[propertyName] = service;
    };
}


