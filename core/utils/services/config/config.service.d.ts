import { SequelizeConfigInterface, AmqpConfigInterface, AppConfigInterface } from './config.interface';
import { ConnectionHookService } from "../../services/connection-hook/connection-hook.service";
export declare class ConfigService {
    private connectionHookService;
    constructor(connectionHookService: ConnectionHookService);
    SEQUELIZE_CONFIG: SequelizeConfigInterface;
    AMQP_CONFIG: AmqpConfigInterface;
    APP_CONFIG: AppConfigInterface;
    getApp(): AppConfigInterface;
    getSequelize(): SequelizeConfigInterface;
    getAmqp(): AmqpConfigInterface;
    setAppConfig(config: AppConfigInterface): void;
    static forRoot(config: {
        APP_CONFIG?: AppConfigInterface;
        AMQP_CONFIG?: AmqpConfigInterface;
        SEQUELIZE_CONFIG?: SequelizeConfigInterface;
    }): typeof ConfigService;
}
