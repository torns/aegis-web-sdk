"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var event_emiter_1 = require("../helper/event-emiter");
var cgiSpeed_1 = require("../helper/cgiSpeed");
var imageSpeed_1 = require("../helper/imageSpeed");
// 上报收集器
var instance;
var Collector = /** @class */ (function (_super) {
    __extends(Collector, _super);
    function Collector(config) {
        var _this = _super.call(this) || this;
        if (instance) {
            return instance;
        }
        else {
            instance = _this;
        }
        _this.bindXhrEvent();
        _this.bindImgEvent();
        _this.bindErrorEvent();
        return _this;
    }
    Collector.prototype.bindXhrEvent = function () {
        cgiSpeed_1["default"](this.onXhrResponse.bind(this));
    };
    Collector.prototype.bindImgEvent = function () {
        imageSpeed_1["default"](this.onImageResponse.bind(this));
    };
    Collector.prototype.bindErrorEvent = function () {
        var _this = this;
        var orgError = window.onerror;
        // rewrite window.oerror
        window.onerror = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.onGlobalError.apply(_this, args);
            orgError && orgError.call.apply(orgError, [window].concat(args));
        };
    };
    // 请求返回时
    Collector.prototype.onXhrResponse = function (data) {
        this.emit('onRecevieXhr', data);
    };
    Collector.prototype.onImageResponse = function (data) {
        this.emit('onRecevieImage', data);
    };
    Collector.prototype.onEventResponse = function (data) {
        this.emit('onRecevieEvent', data);
    };
    Collector.prototype.onGlobalError = function (msg, target, rowNum, colNum, error) {
        this.emit('onRecevieError', {
            msg: msg,
            target: target,
            rowNum: rowNum,
            colNum: colNum,
            error: error
        });
    };
    return Collector;
}(event_emiter_1["default"]));
exports["default"] = Collector;
