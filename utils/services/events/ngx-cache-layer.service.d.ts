import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CacheLayer } from './ngx-cache-layer.layer';
import { CacheLayerInterface, CacheLayerItem } from './ngx-cache-layer.interfaces';
export declare class CacheService {
    _cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]>;
    private map;
    config: any;
    static createCacheInstance<T>(cacheLayer: any): CacheLayer<CacheLayerItem<T>>;
    static isLocalStorageUsable(): boolean;
    getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>>;
    createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>>;
    private LayerHook<T>(layerInstance);
    private protectLayerFromInvaders<T>(cacheLayer);
    private OnExpire<T>(layerInstance);
    removeLayer<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void;
    transferItems(name: string, newCacheLayers: CacheLayerInterface[]): CacheLayer<CacheLayerItem<any>>[];
    static getLayersFromLS(): Array<string>;
    flushCache(force?: boolean): Observable<boolean>;
}
