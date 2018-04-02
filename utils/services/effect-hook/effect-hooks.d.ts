export declare class EffectHooks {
    controllers: Map<string, any>;
    init(): void;
    setHook(name: string, target: any): void;
    getHook(name: any): any;
    hasHook(name: string): boolean;
}
export declare const effectHooks: EffectHooks;
