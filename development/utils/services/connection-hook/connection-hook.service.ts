import { Service } from '../../container';

@Service()
export class ConnectionHookService {

    modifyHooks: {onSubConnection?: Function, onSubOperation?: Function} = {
        onSubConnection: this.onSubConnection,
        onSubOperation: this.onSubOperation
    };

    onSubOperation(message, params, webSocket) {
        return params;
    }

    onSubConnection(connectionParams) {
        return {id: 1, userId: 1, user: {id: 1, type: 'ADMIN'}};
    }
}