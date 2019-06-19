interface handler {
    name: string
    type: number
    callback: Function
}

export default class EventEmiter {
    __EventsList!: {
        [propName: string]: handler[]
    }
    constructor() {
        this.__EventsList = {};
    }

    indexOf(array: any[], value: any) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].callback === value) {
                return i;
            }
        }
        return -1;
    }

    on(name: string, callback: Function, type: number = 0) {
        let events = this.__EventsList[name];

        if (!events) {
            events = this.__EventsList[name] = []
        }

        if (this.indexOf(events, callback) === -1) {

            const handler = {
                name: name,
                type: type || 0,
                callback: callback
            };

            events.push(handler);

            return this
        }

        return this
    };

    one(name: string, callback: Function) {
        this.on(name, callback, 1);
    }

    emit = (name: string, data: any) => {
        let events = this.__EventsList[name];
        let handler!: handler;
        if (events && events.length) {
            events = events.slice();
            // const self = this;

            for(let i = 0; i < events.length; i++) {
                handler = events[i];
                try {
                    const result = handler.callback.apply(this, [data]);
                    if (1 === handler.type) {
                        this.remove(name, handler.callback);
                    }
                    if (false === result) {
                        break;
                    }
                } catch (e) {
                    throw e
                }
            }
        }
        return this;
    }

    remove(name: string, callback: Function) {
        const events = this.__EventsList[name];

        if (!events) {
            return null;
        }

        if (!callback) {
            try {
                delete this.__EventsList[name];
            } catch (e) {
            }
            return null
        }

        if (events.length) {
            const index = this.indexOf(events, callback);
            events.splice(index, 1);
        }

        return this;
    };
}





