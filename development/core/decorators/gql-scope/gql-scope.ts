import Container from "typedi";
import { ControllerConfigService } from "../..";

export function Scope(...arg: string[]): Function {
    const scope = {scope: arg};
    
    const ConfigService = Container.get(ControllerConfigService)
    return (t: any, propertyName: string, desc) => {
        const target = t;
        const descriptor = desc;
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            let result = originalMethod.apply(this, args);
            console.log('DADADADADADASCOPE', result)
            result = {...scope, ...result}; 
           
            return result;
        };
        return descriptor;
    };
  }