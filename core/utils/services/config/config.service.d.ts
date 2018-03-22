/// <reference types="node" />
import { AmqpConfigInterface, AppConfigInterface } from './config.interface';
import { ConnectionHookService } from "../../services/connection-hook/connection-hook.service";
export declare class ConfigService {
    private connectionHookService;
    cert: Buffer;
    AMQP_CONFIG: AmqpConfigInterface;
    APP_CONFIG: AppConfigInterface;
    constructor(connectionHookService: ConnectionHookService);
    getApp(): AppConfigInterface;
    getAmqp(): AmqpConfigInterface;
    setAppConfig(config: AppConfigInterface): void;
    static forRoot(config: {
        APP_CONFIG?: AppConfigInterface;
        AMQP_CONFIG?: AmqpConfigInterface;
    }): typeof ConfigService;
}
