"use strict";
exports.__esModule = true;
var log_1 = require("../interface/log");
var utils_1 = require("../utils");
var logMap = {};
function isRepeat(error, repeat) {
    if (!utils_1.isOBJ(error))
        return true;
    var msg = error.msg || '';
    var times = logMap[msg] = (parseInt(logMap[msg], 10) || 0) + 1;
    return times > repeat;
}
exports.isRepeat = isRepeat;
// 防止错误重复上报
function default_1(maxRepeat) {
    if (maxRepeat === void 0) { maxRepeat = 5; }
    return function (msg, success, fail) {
        if (msg.level === log_1.LOG_TYPE.ERROR && isRepeat(msg, maxRepeat)) {
            fail(msg);
        }
        else {
            success(msg);
        }
    };
}
exports["default"] = default_1;
