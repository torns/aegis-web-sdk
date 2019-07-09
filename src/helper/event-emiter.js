"use strict";
exports.__esModule = true;
var EventEmiter = /** @class */ (function () {
    function EventEmiter() {
        var _this = this;
        this.emit = function (name, data) {
            var events = _this.__EventsList[name];
            var handler;
            if (events && events.length) {
                events = events.slice();
                // const self = this;
                for (var i = 0; i < events.length; i++) {
                    handler = events[i];
                    try {
                        var result = handler.callback.apply(_this, [data]);
                        if (1 === handler.type) {
                            _this.remove(name, handler.callback);
                        }
                        if (false === result) {
                            break;
                        }
                    }
                    catch (e) {
                        throw e;
                    }
                }
            }
            return _this;
        };
        this.__EventsList = {};
    }
    EventEmiter.prototype.indexOf = function (array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].callback === value) {
                return i;
            }
        }
        return -1;
    };
    EventEmiter.prototype.on = function (name, callback, type) {
        if (type === void 0) { type = 0; }
        var events = this.__EventsList[name];
        if (!events) {
            events = this.__EventsList[name] = [];
        }
        if (this.indexOf(events, callback) === -1) {
            var handler = {
                name: name,
                type: type || 0,
                callback: callback
            };
            events.push(handler);
            return this;
        }
        return this;
    };
    ;
    EventEmiter.prototype.one = function (name, callback) {
        this.on(name, callback, 1);
    };
    EventEmiter.prototype.remove = function (name, callback) {
        var events = this.__EventsList[name];
        if (!events) {
            return null;
        }
        if (!callback) {
            try {
                delete this.__EventsList[name];
            }
            catch (e) {
            }
            return null;
        }
        if (events.length) {
            var index = this.indexOf(events, callback);
            events.splice(index, 1);
        }
        return this;
    };
    ;
    return EventEmiter;
}());
exports["default"] = EventEmiter;
