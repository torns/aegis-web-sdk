"use strict";
exports.__esModule = true;
var alreadyOverride = false;
function overrideXhr(notify) {
    if (alreadyOverride)
        return;
    alreadyOverride = true;
    var xhrProto = window.XMLHttpRequest.prototype, originOpen = xhrProto.open, originSend = xhrProto.send;
    //改写open
    xhrProto.open = function (method, url) {
        var xhr = this, args = arguments;
        xhr.speedLog = {
            url: url,
            method: method,
            openTime: Date.now()
        };
        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState === 4) {
                xhr.speedLog.responseTime = Date.now();
                xhr.speedLog.duration = xhr.speedLog.responseTime - xhr.speedLog.sendTime;
                notify && notify(xhr.speedLog);
            }
        });
        return originOpen.apply(xhr, args);
    };
    // //改写send
    xhrProto.send = function () {
        var xhr = this;
        xhr.speedLog.sendTime = Date.now();
        return originSend.apply(xhr, arguments);
    };
}
exports["default"] = overrideXhr;
