'use strict';
interface handler {
    resolve: Function
    reject: Function | undefined
}


function defaultFail(err: any) {
    return err;
}

export default class InterceptorManager {
    handlers: handler[] = [];

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} success The function to handle `then` for a `Promise`
     * @param {Function} fail The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use = (resolve: Function, reject?: Function) => {
        this.handlers.push({
            resolve,
            reject
        });
        return this.handlers.length - 1;
    }

    run = (data: any, _resolve: Function, _reject: Function = defaultFail) => {
        const handlers = this.handlers.concat({
            resolve: _resolve,
            reject: _reject
        });

        function _run(data: any) {
            const handler = handlers.shift();

            if(handler) {
                const {
                    resolve,
                    reject
                } = handler as handler;
                
                resolve(data, (_data: any) => {
                    _run(_data);
                }, (err: any) => {
                    if (reject) {
                        reject(err);
                    } else {
                        _reject && _reject(err);
                    }
                });
            }
        }

        _run(data);
    }

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    remove = (id: number) => {
        if (id >= this.handlers.length || id < 0) {
            return;
        }
        this.handlers.splice(id, 1);
    }

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    forEach = (fn: Function) => {
        this.handlers.forEach((h) => {
            fn(h);
        });
    }
}