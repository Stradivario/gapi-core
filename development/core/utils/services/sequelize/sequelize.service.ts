import { Sequelize } from 'sequelize-typescript';
import Container, {Service} from '../../../utils/container/index';
import { ConfigService } from '../../services/config/config.service';

@Service()
export class SequelizeService extends Sequelize {
    constructor(private config: ConfigService) {
        super(<any>config.SEQUELIZE_CONFIG.testing);
    }
    sync(settings?: { force?: boolean, logging?: boolean | Function }): any {
        return super.sync(settings || { force: false, logging: true });
    }
    close() {
        return super.close();
    }
}
