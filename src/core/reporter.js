"use strict";
exports.__esModule = true;
var log_1 = require("../interface/log");
var collector_1 = require("./collector");
var processor_1 = require("./processor");
var offlinelog_1 = require("../helper/offlinelog");
var send_1 = require("../helper/send");
var index_1 = require("../utils/index");
var instance;
var baseConfig = {
    id: 0,
    uin: 0,
    isDebug: false,
    isWhiteList: false,
    url: '//aegis.qq.com/badjs',
    version: 0,
    ext: null,
    level: 4,
    ignore: [],
    random: 1,
    delay: 1000,
    maxLength: 500,
    monitorUrl: '//report.url.cn/report/report_vm',
    repeat: 5,
    offlineLog: false,
    offlineLogExp: 3,
    offlineLogAuto: false // 是否自动询问服务器需要自动上报
};
var Reporter = /** @class */ (function () {
    function Reporter(config) {
        var _this = this;
        // 日志的缓存池
        this.eventLog = []; // 等待上报的日志
        this.speedLog = []; // 等待上报的日志
        this.imageLog = []; // 等待上报的日志
        this.normalLog = []; //等待上报的日志
        this.setConfig = function (config) {
            _this._config = index_1.extend(baseConfig, _this._config, config);
            var id = parseInt(config.id, 10);
            if (!id) {
                console.log('aegis 初始化失败 未传入项目id');
                return;
            }
            if (/qq\.com$/gi.test(location.hostname)) {
                if (!config.uin) {
                    config.uin = parseInt((document.cookie.match(/\buin=\D+(\d+)/) || [])[1], 10);
                }
            }
            if (!config.url) {
                config.url = '//aegis.qq.com/badjs';
            }
            _this._reportUrl = (config.url || '//aegis.qq.com/badjs') +
                '?id=' + id +
                '&uin=' + _this._config.uin +
                '&version=' + _this._config.version +
                '&from=' + encodeURIComponent(location.href) +
                '&';
            _this._config = config;
            return _this._config;
        };
        this.handlerRecevieError = function (data) {
            _this.error(data, true);
        };
        this.handlerRecevieXhr = function (data) {
            console.log(data);
        };
        this.handlerRecevieImage = function (data) {
            console.log(data);
        };
        this.submitLog = function (msg) {
            var _url = _this._reportUrl + send_1.formatParams(msg) + '&_t=' + (+new Date());
            send_1.send(_url);
        };
        this.startReportTask = function (msg) {
            _this.normalLog.push(msg);
            if (_this._reportTask) {
                return;
            }
            _this._reportTask = setTimeout(function () {
                _this.submitLog(_this.normalLog);
                _this._reportTask = 0; // clear task
                _this.normalLog = []; // clear pool 
            }, _this._config.delay);
        };
        // TODO
        this.report = function (msg, immediately) {
            if (immediately === void 0) { immediately = false; }
            var _a = _this._config, id = _a.id, onReport = _a.onReport, offlineLog = _a.offlineLog;
            if (offlineLog) {
                var offline = _this._offlineLog;
                // 默认全部写入离线日志
                var prefix = 'badjs_' + _this._config.id + _this._config.uin;
                offline.save2Offline(prefix, msg, _this._config);
            }
            if (immediately) {
                _this.submitLog(msg); // 立即上报
            }
            else {
                _this.startReportTask(msg);
            }
            if (onReport) {
                onReport(id, msg);
            }
        };
        this.info = function (msg, immediately) {
            if (immediately === void 0) { immediately = false; }
            _this._processor.processNormalLog(msg, log_1.LOG_TYPE.INFO, function (_msg) {
                _this.report(_msg, immediately);
            }, function (err) {
                // TODO 
            });
        };
        this.error = function (msg, immediately) {
            if (immediately === void 0) { immediately = false; }
            _this._processor.processNormalLog(msg, log_1.LOG_TYPE.ERROR, function (_msg) {
                _this.report(_msg, immediately);
            }, function (err) {
                // TODO 
            });
        };
        // 初始化离线数据库
        this._initOffline = function () {
            _this._offlineLog = new offlinelog_1["default"]();
            _this._offlineLog.ready(function (err) {
                if (err) {
                    return;
                }
                setTimeout(function () {
                    _this._offlineLog.clearDB(_this._config.offlineLogExp);
                    setTimeout(function () {
                        _this._config.offlineLogAuto && _this._autoReportOffline();
                    }, 5000);
                }, 1000);
            });
            return _this;
        };
        // 询问服务器是否上报离线日志
        this._autoReportOffline = function () {
            var script = document.createElement('script');
            script.src = _this._config.url + "/offlineAuto?id=" + _this._config.id + "&uin=" + _this._config.uin;
            // 通过 script 的返回值执行回调
            window._badjsOfflineAuto = function (secretKey) {
                if (secretKey) {
                    _this.reportOfflineLog(secretKey);
                }
                document.head.removeChild(script);
            };
            document.head.appendChild(script);
        };
        // 上报离线日志
        this.reportOfflineLog = function (secretKey) {
            if (!window.indexedDB) {
                _this.info('unsupport offlineLog');
                return;
            }
            _this._offlineLog.ready(function (err) {
                if (err) {
                    return;
                }
                var startDate = Date.now() - _this._config.offlineLogExp * 24 * 3600 * 1000;
                var endDate = Date.now();
                _this._offlineLog.getLogs({
                    start: startDate,
                    end: endDate,
                    id: _this._config.id,
                    uin: _this._config.uin
                }, function (err, logs, msgObj, urlObj) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('offline logs length:', logs.length);
                    var reportData = { logs: logs, msgObj: msgObj, urlObj: urlObj, startDate: startDate, endDate: endDate, secretKey: secretKey };
                    var _a = _this._config, id = _a.id, uin = _a.uin, url = _a.url;
                    var userAgent = navigator.userAgent;
                    var data = JSON.stringify(index_1.extend(reportData, {
                        userAgent: userAgent,
                        id: id,
                        uin: uin
                    }));
                    var _url = url + '/offlineLog';
                    send_1.sendOffline(_url, data);
                });
            });
        };
        if (instance) {
            return instance;
        }
        else {
            instance = this;
        }
        var _config = this.setConfig(config);
        this._collector = new collector_1["default"](this._config);
        this._processor = new processor_1["default"](this._config);
        if (this._config.offlineLog) {
            this._initOffline();
        }
        this.reportPv();
        this._collector.on('onRecevieError', this.handlerRecevieError);
        this._collector.on('onRecevieXhr', this.handlerRecevieXhr);
        this._collector.on('onRecevieImage', this.handlerRecevieImage);
    }
    Reporter.prototype.reportPv = function () {
        send_1.send(this._config.url + "/" + this._config.id);
    };
    Reporter.prototype.debug = function (msg, immediately) {
        var _this = this;
        if (immediately === void 0) { immediately = false; }
        if (this._config.isDebug) {
            return;
        }
        this._processor.processNormalLog(msg, log_1.LOG_TYPE.DEBUG, function (_msg) {
            _this.report(_msg, immediately);
        }, function (err) {
            // TODO 
        });
    };
    // 测速
    Reporter.prototype.speed = function (event, time) {
    };
    // 用于统计上报
    Reporter.monitor = function (n, monitorUrl) {
        if (monitorUrl === void 0) { monitorUrl = '//report.url.cn/report/report_vm'; }
        // 如果n未定义或者为空，则不处理
        if (typeof n === 'undefined' || n === '') {
            return;
        }
        // 如果n不是数组，则将其变成数组。注意这里判断方式不一定完美，却非常简单
        if (typeof n.join === 'undefined') {
            n = [n];
        }
        var p = {
            monitors: '[' + n.join(',') + ']',
            _: Math.random()
        };
        if (monitorUrl) {
            var _url = monitorUrl + (monitorUrl.match(/\?/) ? '&' : '?') + index_1.buildParam(p);
            new Image().src = _url;
        }
    };
    return Reporter;
}());
exports.Reporter = Reporter;
