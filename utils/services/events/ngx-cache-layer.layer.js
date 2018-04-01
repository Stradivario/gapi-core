"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const Rx_1 = require("rxjs/Rx");
const FRIENDLY_ERROR_MESSAGES = {
    MISSING_OBSERVABLE_ITEM: `is missing from the layer misspelled name ? as soon as you provide correct name value will be emitted!`
};
class CacheLayer {
    constructor(layer) {
        this.items = new BehaviorSubject_1.BehaviorSubject([]);
        this.map = new Map();
        this.name = layer.name;
        this.config = layer.config;
        if (this.config.localStorage) {
            layer.items.forEach(item => this.map.set(item['key'], item));
            if (layer.items.constructor === BehaviorSubject_1.BehaviorSubject) {
                layer.items = layer.items.getValue() || [];
            }
            this.items.next([...this.items.getValue(), ...layer.items]);
        }
        this.initHook(layer);
    }
    static createCacheParams(config) {
        if (config.params.constructor === Object) {
            return; // Todo
        }
        else if (config.constructor === String) {
            return; // Todo
        }
        else if (config.params.constructor === Number) {
            return; // Todo
        }
        else if (config.params.constructor === Array) {
            return; // Todo
        }
    }
    get(name) {
        return this.map.get(name);
    }
    initHook(layer) {
        if (this.config.maxAge) {
            this.onExpireAll(layer);
        }
    }
    onExpireAll(layer) {
        layer.items.forEach(item => this.onExpire(item['key']));
    }
    putItemHook(layerItem) {
        if (this.config.maxAge) {
            this.onExpire(layerItem['key']);
        }
    }
    getItem(key) {
        if (this.map.has(key)) {
            return this.get(key);
        }
        else {
            return null;
        }
    }
    putItem(layerItem) {
        this.map.set(layerItem['key'], layerItem);
        const item = this.get(layerItem['key']);
        const filteredItems = this.items.getValue().filter(item => item['key'] !== layerItem['key']);
        if (this.config.localStorage) {
            localStorage.setItem(this.name, JSON.stringify({
                config: this.config,
                name: this.name,
                items: [...filteredItems, item]
            }));
        }
        this.items.next([...filteredItems, item]);
        this.putItemHook(layerItem);
        return layerItem;
    }
    onExpire(key) {
        Rx_1.Observable
            .create(observer => observer.next())
            .timeoutWith(this.config.maxAge, Rx_1.Observable.of(1))
            .skip(1)
            .subscribe(observer => this.removeItem(key));
    }
    removeItem(key) {
        const newLayerItems = this.items.getValue().filter(item => item['key'] !== key);
        if (this.config.localStorage) {
            const newLayer = {
                config: this.config,
                name: this.name,
                items: newLayerItems
            };
            localStorage.setItem(this.name, JSON.stringify(newLayer));
        }
        this.map.delete(key);
        this.items.next(newLayerItems);
    }
    getItemObservable(key) {
        this.map.has(key) ? null : console.error(`Key: ${key} ${FRIENDLY_ERROR_MESSAGES.MISSING_OBSERVABLE_ITEM}`);
        return this.items.asObservable().filter(() => this.map.has(key)).map(res => res[0]);
    }
    flushCache() {
        return this.items.asObservable()
            .map(items => {
            items.forEach(i => this.removeItem(i['key']));
            return true;
        });
    }
}
exports.CacheLayer = CacheLayer;
// console.log(Array.from(this.keys())) 
