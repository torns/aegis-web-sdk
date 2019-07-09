'use strict';
exports.__esModule = true;
function defaultFail(err) {
    return err;
}
var InterceptorManager = /** @class */ (function () {
    function InterceptorManager() {
        var _this = this;
        this.handlers = [];
        /**
         * Add a new interceptor to the stack
         *
         * @param {Function} success The function to handle `then` for a `Promise`
         * @param {Function} fail The function to handle `reject` for a `Promise`
         *
         * @return {Number} An ID used to remove interceptor later
         */
        this.use = function (resolve, reject) {
            _this.handlers.push({
                resolve: resolve,
                reject: reject
            });
            return _this.handlers.length - 1;
        };
        this.run = function (data, _resolve, _reject) {
            if (_reject === void 0) { _reject = defaultFail; }
            var handlers = _this.handlers.concat({
                resolve: _resolve,
                reject: _reject
            });
            function _run(data) {
                var handler = handlers.shift();
                if (handler) {
                    var _a = handler, resolve = _a.resolve, reject_1 = _a.reject;
                    resolve(data, function (_data) {
                        _run(_data);
                    }, function (err) {
                        if (reject_1) {
                            reject_1(err);
                        }
                        else {
                            _reject && _reject(err);
                        }
                    });
                }
            }
            _run(data);
        };
        /**
         * Remove an interceptor from the stack
         *
         * @param {Number} id The ID that was returned by `use`
         */
        this.remove = function (id) {
            if (id >= _this.handlers.length || id < 0) {
                return;
            }
            _this.handlers.splice(id, 1);
        };
        /**
         * Iterate over all the registered interceptors
         *
         * This method is particularly useful for skipping over any
         * interceptors that may have become `null` calling `eject`.
         *
         * @param {Function} fn The function to call for each interceptor
         */
        this.forEach = function (fn) {
            _this.handlers.forEach(function (h) {
                fn(h);
            });
        };
    }
    return InterceptorManager;
}());
exports["default"] = InterceptorManager;
