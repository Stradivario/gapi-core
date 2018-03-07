import { Sequelize } from 'sequelize-typescript';
import { ConfigService, SequelizeConfigInterface } from '../../utils';
import Container, { Service } from '../../utils/container';

@Service()
export class GapiSequelizeService extends Sequelize {
    constructor(c) {
        const config = Container.get(ConfigService);
        super(c || config.SEQUELIZE_CONFIG.testing);
    }
    sync(settings?: { force?: boolean, logging?: boolean | Function }): any {
        return super.sync(settings || { force: false, logging: true });
    }
    static forRoot(config: SequelizeConfigInterface) {
        const configService = Container.get(ConfigService);
        Object.assign(configService.SEQUELIZE_CONFIG, config)
        return GapiSequelizeService;
    }
}
