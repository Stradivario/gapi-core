import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CacheLayer } from './events-layer';
import { CacheLayerInterface, CacheLayerItem } from './events-layer.interfaces';
export declare class CacheService {
    _cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]>;
    map: Map<any, any>;
    config: any;
    static createCacheInstance<T>(cacheLayer: any): CacheLayer<CacheLayerItem<T>>;
    getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>>;
    createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>>;
    private LayerHook<T>(layerInstance);
    private protectLayerFromInvaders<T>(cacheLayer);
    private OnExpire<T>(layerInstance);
    removeLayer<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void;
    transferItems(name: string, newCacheLayers: CacheLayerInterface[]): CacheLayer<CacheLayerItem<any>>[];
    flushCache(): Observable<boolean>;
}
