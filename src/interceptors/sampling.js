"use strict";
exports.__esModule = true;
// 抽样丢弃
function default_1(threshold) {
    if (threshold === void 0) { threshold = 0; }
    return function (msg, success, fail) {
        if (Math.random() > threshold) {
            success(msg);
        }
        else {
            fail(msg);
        }
    };
}
exports["default"] = default_1;
