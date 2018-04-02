import { Token } from '../../utils/container/Token';
export interface Containers {
    token: Token<any>;
    useFactory: () => any;
}
export interface GapiModuleArguments {
    imports?: Array<Containers | any>;
    services?: Array<Containers | any>;
    controllers?: Array<Containers | any>;
    types?: Array<Containers | any>;
    effects?: Array<Containers | any>;
}
