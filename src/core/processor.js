"use strict";
exports.__esModule = true;
var interceptors_manager_1 = require("../helper/interceptors-manager");
var formatlog_1 = require("../interceptors/formatlog");
var ignore_1 = require("../interceptors/ignore");
var repeat_limit_1 = require("../interceptors/repeat-limit");
var length_limit_1 = require("../interceptors/length-limit");
var sampling_1 = require("../interceptors/sampling");
var index_1 = require("../utils/index");
var instance;
var Processor = /** @class */ (function () {
    function Processor(config) {
        if (instance) {
            return instance;
        }
        else {
            instance = this;
        }
        this.logInterceptor = new interceptors_manager_1["default"]();
        this.logInterceptor.use(formatlog_1["default"]());
        this.logInterceptor.use(sampling_1["default"](config.random));
        this.logInterceptor.use(length_limit_1["default"](config.maxLength));
        this.logInterceptor.use(repeat_limit_1["default"](config.repeat));
        this.logInterceptor.use(ignore_1["default"](config.ignore));
    }
    // 测速日志
    Processor.prototype.processSpeedLog = function (logs) {
    };
    // 资源日志
    Processor.prototype.processAssetsLog = function (logs) {
    };
    // 普通日志
    Processor.prototype.processNormalLog = function (_msg, logType, success, fail) {
        var msg = index_1.isOBJ(_msg) ? index_1.extend({}, _msg, {
            level: logType
        }) : {
            msg: _msg
        };
        this.logInterceptor.run(msg, success, fail);
    };
    return Processor;
}());
exports["default"] = Processor;
