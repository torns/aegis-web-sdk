"use strict";
exports.__esModule = true;
var index_1 = require("../utils/index");
// 抽样丢弃
function default_1(ignore) {
    var _ignore = index_1.isOBJByType(ignore, 'Array') ? ignore : [ignore];
    return function (msg, success, fail) {
        var isIgnore = false;
        for (var i = 0, l = _ignore.length; i < l; i++) {
            var rule = _ignore[i];
            if (index_1.isOBJByType(rule, 'RegExp')) {
                if (rule.test(msg.msg)) {
                    isIgnore = true;
                }
            }
            else if (index_1.isOBJByType(rule, 'Function')) {
                if (rule(msg, msg.msg)) {
                    isIgnore = true;
                }
            }
        }
        if (!isIgnore) {
            success(msg);
        }
        else {
            fail(msg);
        }
    };
}
exports["default"] = default_1;
