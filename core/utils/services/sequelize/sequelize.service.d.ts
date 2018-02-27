import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '../../services/config/config.service';
export declare class SequelizeService extends Sequelize {
    private config;
    constructor(config: ConfigService);
    sync(settings?: {
        force?: boolean;
        logging?: boolean | Function;
    }): any;
    close(): void;
}
