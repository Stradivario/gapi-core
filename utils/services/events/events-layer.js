"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const Rx_1 = require("rxjs/Rx");
class CacheLayer {
    constructor(layer) {
        this.items = new BehaviorSubject_1.BehaviorSubject([]);
        this.map = new Map();
        this.name = layer.name;
        this.config = layer.config;
        this.initHook(layer);
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
        this.map.delete(key);
        this.items.next(newLayerItems);
    }
    getItemObservable(key) {
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
