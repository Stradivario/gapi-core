export declare class ControllerHooks {
    controllers: Map<string, any>;
    init(): void;
    setHook(name: string, target: any): void;
    getHook(name: any): any;
    hasHook(name: string): boolean;
}
export declare const controllerHooks: ControllerHooks;
