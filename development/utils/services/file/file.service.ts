import { Service } from '../../container';
import { writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';

@Service()
export class FileService {
    writeEffectTypes(effects: Array<any>) {
        if (process.env.DISABLE_EFFECTS || effects && !effects.length) {
            return;
        }
        const types = `
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
export const EffectTypes = strEnum(${JSON.stringify(effects).replace(/"/g, `'`).replace(/,/g, ',\n')});
export type EffectTypes = keyof typeof EffectTypes;
`;
          const folder = process.env.INTROSPECTION_FOLDER || `./src/app/core/api-introspection/`;
            ensureDirSync(folder);
            writeFileSync(folder + 'EffectTypes.ts', types, 'utf8');
    }
}