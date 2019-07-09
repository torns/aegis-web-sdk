"use strict";
exports.__esModule = true;
function default_1(maxLength) {
    return function (msg, success, fail) {
        // 有效保证字符不要过长
        msg.msg = (msg.msg + '' || '').substr(0, maxLength);
        success(msg);
    };
}
exports["default"] = default_1;
