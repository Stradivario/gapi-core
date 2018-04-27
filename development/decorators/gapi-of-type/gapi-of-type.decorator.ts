import { Container } from '../../utils/container/index';
import { CacheService } from '../../utils/services/events/ngx-events-layer.service';
import { effectHooks } from '../../utils/services/effect-hook/effect-hooks';

export function OfType<T>(type: T) {
  return (target, propertyKey, descriptor) => {
    const t = target;
    Container.get(CacheService)
      .getLayer<Array<any>>(<any>type)
      .getItemObservable(<any>type)
      .subscribe(async item => {
        const c = effectHooks.getHook(t.constructor.name);
        const originalDesc = descriptor.value.bind(c);
        await originalDesc(...item.data);
      });
  };
}
