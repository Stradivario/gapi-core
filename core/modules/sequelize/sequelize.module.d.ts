import { Sequelize } from 'sequelize-typescript';
import { SequelizeConfigInterface } from '../../utils';
export declare class GapiSequelizeService extends Sequelize {
    constructor(c: any);
    sync(settings?: {
        force?: boolean;
        logging?: boolean | Function;
    }): any;
    static forRoot(config: SequelizeConfigInterface): typeof GapiSequelizeService;
}
