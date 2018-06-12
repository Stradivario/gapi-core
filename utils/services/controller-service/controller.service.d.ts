import { ControllerMapping } from './controller-mapping';
export declare class ControllerContainerService {
    controllers: Map<string, ControllerMapping>;
    getController(name: string): ControllerMapping;
    createController(name: string): ControllerMapping;
    controllerReady(name: string): void;
}
