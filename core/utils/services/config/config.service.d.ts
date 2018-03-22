/// <reference types="node" />
import { AmqpConfigInterface, AppConfigInterface } from './config.interface';
import { ConnectionHookService } from "../../services/connection-hook/connection-hook.service";
export declare class ConfigService {
    private connectionHookService;
    cert: Buffer;
    constructor(connectionHookService: ConnectionHookService);
    AMQP_CONFIG: AmqpConfigInterface;
    APP_CONFIG: AppConfigInterface;
    getApp(): AppConfigInterface;
    getAmqp(): AmqpConfigInterface;
    setAppConfig(config: AppConfigInterface): void;
    static forRoot(config: {
        APP_CONFIG?: AppConfigInterface;
        AMQP_CONFIG?: AmqpConfigInterface;
    }): typeof ConfigService;
}
