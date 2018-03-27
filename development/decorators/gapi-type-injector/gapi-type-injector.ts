import Container from '../../utils/container/index';

function InjectTypePrivate<T>(Type) {
    const currentType = new Type();
    if (!Container.has(currentType.name)) {
        Container.set(currentType.name, currentType);
    }
    return Container.get<T>(currentType.name);
}

// Beta type injector not working in this moment
export function TypeInjector<T, K extends keyof T>(Type): Function {
    return function (target: Function, propertyName: string, index?: number) {
        target[propertyName] = InjectTypePrivate(Type);
        target.constructor.prototype[propertyName] = InjectTypePrivate(Type);
    };
}

export function InjectType<T, K extends keyof T>(Service): T {
    return InjectTypePrivate<T>(Service);
}
