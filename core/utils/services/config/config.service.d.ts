import { SequelizeConfigInterface, AmqpConfigInterface, AppConfigInterface } from './config.interface';
export declare class ConfigService {
    SEQUELIZE_CONFIG: SequelizeConfigInterface;
    AMQP_CONFIG: AmqpConfigInterface;
    APP_CONFIG: AppConfigInterface;
    getApp(): AppConfigInterface;
    getSequelize(): SequelizeConfigInterface;
    getAmqp(): AmqpConfigInterface;
    setAppConfig(config: AppConfigInterface): void;
    syncSchema(): Promise<void>;
}
