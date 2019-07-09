"use strict";
exports.__esModule = true;
var log_1 = require("../interface/log");
var utils_1 = require("../utils");
function default_1() {
    return function (data, success, fail) {
        var msg = data.msg, _a = data.rowNum, rowNum = _a === void 0 ? 0 : _a, _b = data.colNum, colNum = _b === void 0 ? 0 : _b, _c = data.target, target = _c === void 0 ? location.href : _c, error = data.error, _d = data.level, level = _d === void 0 ? log_1.LOG_TYPE.ERROR : _d;
        if (error && error.stack) {
            var regResult = error.stack.match('https?://[^\n]+');
            var url = regResult ? regResult[0] : '';
            var rowResult = url.match(':(\\d+):(\\d+)');
            var rowCols = rowResult ? rowResult.slice() : ['0', '0', '0'];
            var stack = utils_1.formatStackMsg(error);
            success({
                msg: stack,
                rowNum: rowCols[1] || rowNum,
                colNum: rowCols[2] || rowCols,
                target: url.replace(rowCols[0], '') || target,
                level: level
            });
        }
        else if (utils_1.isOBJ(msg)) {
            var value = '';
            try {
                value = JSON.stringify(msg);
            }
            catch (err) {
                value = '[BJ_REPORT detect value stringify error] ' + err.toString();
            }
            success({
                msg: value,
                rowNum: rowNum,
                colNum: colNum,
                target: target,
                level: level
            });
        }
        else {
            var _unformatMsg = msg;
            if (typeof _unformatMsg !== 'string') {
                _unformatMsg = _unformatMsg.toString();
            }
            success({
                msg: _unformatMsg,
                rowNum: rowNum,
                colNum: colNum,
                target: location.href,
                level: level
            });
        }
    };
}
exports["default"] = default_1;
