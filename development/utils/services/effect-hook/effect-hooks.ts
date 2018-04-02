
export class EffectHooks {
    controllers: Map<string, any> = new Map();

    init() { }

    setHook(name: string, target: any) {
        this.controllers.set(name, target);
    }

    getHook(name) {
        if (this.hasHook(name)) {
            return this.controllers.get(name);
        } else {
            throw new Error('Hook not found!');
        }
    }

    hasHook(name: string) {
        return this.controllers.has(name);
    }
}

export const effectHooks = new EffectHooks();