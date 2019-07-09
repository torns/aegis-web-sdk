"use strict";
exports.__esModule = true;
var alreadyOverride = false;
function overrideFetch(notify) {
    if (alreadyOverride)
        return;
    alreadyOverride = true;
    var originFetch = window.fetch;
    window.fetch = function () {
        var args = Array.prototype.slice.call(arguments);
        var speedLog = {
            url: args[0],
            method: args[1] ? args[1].method || 'get' : 'get',
            openTime: Date.now(),
            sendTime: Date.now()
        };
        var fetchPromise = originFetch.apply(void 0, args);
        fetchPromise.then(function (res) {
            speedLog.responseTime = Date.now();
            speedLog.duration = speedLog.responseTime - speedLog.sendTime;
            notify && notify(speedLog);
            return res;
        });
        return fetchPromise;
    };
}
exports["default"] = overrideFetch;
