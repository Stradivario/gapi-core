export declare class ControllerConfigService {
    config: Map<any, {
        scope: string[];
        type: any;
    }>;
    get(name: string): {};
    set(name: string, config: any): void;
}
