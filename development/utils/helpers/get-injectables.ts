import Container from '../../utils/container/index';

export function getInjectables(module) {
    const injectables = [];
    module.deps.forEach(i => {
        if (i.name) {
            return injectables.push(Container.get(i));
        } else if (i.constructor === Function) {
            return injectables.push(Container.get(i));
        } else {
            return injectables.push(i);
        }
    });
    return injectables;
}
