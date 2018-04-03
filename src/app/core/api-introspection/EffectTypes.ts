
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
export const EffectTypes = strEnum(['myevent',
'findUser2',
'findUser3',
'findUser5']);
export type EffectTypes = keyof typeof EffectTypes;
