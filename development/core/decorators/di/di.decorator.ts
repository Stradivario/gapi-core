import "reflect-metadata";

type Newable<T> = new (...args : any[]) => T;

export class Injector {

    private static constructedInstances : {cx: Newable<any>, object: any}[] = [];

    public static inject<T>(originalConstructor : Newable<T>) : Newable<T> {
        const paramTypes = Reflect.getOwnMetadata("design:paramtypes", originalConstructor);

        if(paramTypes.length == 0){
            Injector.constructedInstances.push({cx: originalConstructor, object: null});
            return originalConstructor;
        }

        const newArgs = paramTypes.map((f : any) => Injector.get(f));
        const newConstructor = originalConstructor.bind(null, newArgs);

        Injector.constructedInstances.push({cx: newConstructor, object: null});

        return newConstructor;
    }

    public static get(cx : Newable<any>) : any {
        const ci = this.constructedInstances.find(f => f.cx == cx);

        if(!ci){
            throw "Invalid DI configuration.";
        }

        if(ci.object == null){
            ci.object = new ci.cx();
        }

        return ci.object;
    }

}

export function Inject<T>(originalConstructor : Newable<T>) : Newable<T> {
    return Injector.inject(originalConstructor);
}