import { Service } from '../../../../utils/container/index';

@Service()
export class ResolveEventsService {
    events: Map<string, any> = new Map();

    init() { }

    setEvent(name: string, target: any) {
        this.events.set(name, target);
    }

    getEvent(name) {
        if (this.hasEvent(name)) {
            return this.events.get(name);
        } else {
            throw new Error('Event not found!');
        }
    }

    hasEvent(name: string) {
        return this.events.has(name);
    }

    emitEvent(name, data) {
    }
}
