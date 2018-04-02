import { Container, Service } from '../../utils';
import { OfType } from './gapi-of-type.decorator';

function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}

const GapiEffects = strEnum([
    'findUser'
]);

type GapiEffects = keyof typeof GapiEffects;

@Service()
class UserEffectsService {

    @OfType<GapiEffects>(GapiEffects.findUser)
    findUser(args, context, info) {
        console.log(args, context);
    }
}

Container.get(UserEffectsService);


describe('Decorators: @OfType', () => {
    it('Should emit effect based on resolved resolver', (done) => {
        const mutation: TestingMutation = <any>Container.get(ClassTestProvider).mutation(null, {id: null}, null);

        done();
    });
});