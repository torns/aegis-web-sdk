"use strict";
exports.__esModule = true;
var index_1 = require("../utils/index");
var offlineBuffer = [];
/**
 * 封装对 IndexDB 的读写操作
 */
var OfflineDB = /** @class */ (function () {
    function OfflineDB() {
        var _this = this;
        this.getStore = function () {
            var transaction = _this.db.transaction('logs', 'readwrite');
            return transaction.objectStore('logs');
        };
        this.ready = function (callback) {
            if (!window.indexedDB) {
                return callback('no support');
            }
            if (_this.db) {
                setTimeout(function () {
                    callback(null);
                }, 0);
                return;
            }
            var version = 1;
            var request = window.indexedDB.open('badjs', version);
            if (!request) {
                return callback('no request');
            }
            request.onerror = function (e) {
                callback(e);
                _this.offlineLog = false;
            };
            request.onsuccess = function (e) {
                _this.db = request.result;
                setTimeout(function () {
                    callback(null);
                }, 500);
            };
            request.onupgradeneeded = function (e) {
                var db = request.result;
                if (!db.objectStoreNames.contains('logs')) {
                    db.createObjectStore('logs', { autoIncrement: true });
                }
            };
        };
        this.insertToDB = function (log) {
            var store = _this.getStore();
            store.add(log);
        };
        this.addLogs = function (logs) {
            if (!_this.db) {
                return;
            }
            for (var i = 0; i < logs.length; i++) {
                _this.insertToDB(logs[i]);
            }
        };
        this.clearDB = function (daysToMaintain) {
            if (!_this.db) {
                return;
            }
            var store = _this.getStore();
            if (!daysToMaintain) {
                store.clear();
                return;
            }
            var range = (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000);
            var request = store.openCursor();
            request.onsuccess = function (event) {
                var cursor = request.result;
                if (cursor && (cursor.value.time < range || !cursor.value.time)) {
                    store["delete"](cursor.primaryKey);
                    cursor["continue"]();
                }
            };
        };
        this.save2Offline = function (key, _msgObj, config) {
            var msgObj = index_1.extend({
                id: config.id,
                uin: config.uin,
                time: Date.now() - 0,
                version: config.version
            }, _msgObj);
            if (_this.db) {
                _this.insertToDB(msgObj);
                return;
            }
            if (!_this.db && !offlineBuffer.length) {
                _this.ready(function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    if (offlineBuffer.length) {
                        _this.addLogs(offlineBuffer);
                        offlineBuffer = [];
                    }
                });
            }
            offlineBuffer.push(msgObj);
        };
        this.db = null;
    }
    /**
     * 过滤出日期和id还有uid相符合的日志信息
     * @param opt
     * @param callback
     */
    OfflineDB.prototype.getLogs = function (opt, callback) {
        if (!this.db) {
            return;
        }
        var store = this.getStore();
        var request = store.openCursor();
        var result = [];
        var msgObj = {};
        var msgList = [];
        var urlObj = {};
        var urlList = [];
        var num = 0;
        var num1 = 0;
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor && cursor.value) {
                if (cursor.value.time >= opt.start && cursor.value.time <= opt.end &&
                    index_1.equal(cursor.value.id, opt.id) && index_1.equal(cursor.value.uin, opt.uin)) {
                    var _a = cursor.value, from = _a.from, level = _a.level, msg = _a.msg, time = _a.time, version = _a.version;
                    if (typeof msgObj[msg] !== 'number') {
                        msgList.push(msg);
                        msgObj[msg] = num++;
                    }
                    if (typeof urlObj[from] !== 'number') {
                        urlList.push(from);
                        urlObj[from] = num1++;
                    }
                    result.push({
                        f: urlObj[from],
                        l: level,
                        m: msgObj[msg],
                        t: time,
                        v: version
                    });
                }
                cursor["continue"]();
            }
            else {
                callback(null, result, msgList, urlList);
            }
        };
        request.onerror = function (e) {
            callback(e);
        };
    };
    return OfflineDB;
}());
exports["default"] = OfflineDB;
