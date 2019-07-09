"use strict";
exports.__esModule = true;
var alreadyOverride = false;
function overrideImage(notify) {
    if (alreadyOverride)
        return;
    alreadyOverride = true;
    var realImage = window.Image;
    window.Image = function (width, height) {
        var img = new realImage(width, height);
        var speedLog = {
            method: 'get',
            openTime: Date.now(),
            sendTime: Date.now(),
            ret: 0,
            status: 200
        };
        img.addEventListener('load', function () {
            speedLog.url = img.src;
            speedLog.responseTime = Date.now();
            speedLog.duration = speedLog.responseTime - speedLog.sendTime;
            notify && notify(speedLog);
        });
        return img;
    };
}
exports["default"] = overrideImage;
