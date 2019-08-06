import { SpeedLog, EventLog, NormalLog, LOG_TYPE, AegisConfig } from '../interface/log';
import { isOBJByType, formatStackMsg } from '../utils';
import EventEmiter from '../helper/event-emiter';
import cgiSpeed from '../helper/cgiSpeed';
import assetSpeed from '../helper/assetSpeed';
// 上报收集器

let instance: Collector;

export default class Collector extends EventEmiter {
    constructor(config: AegisConfig) {
        super();
        if(instance) {
            return instance;
        } else {
            instance = this;
        }
        
        if (config.reportAssetSpeed) {
            this.bindAssetEvent();
        }
        // 有些业务会通过xhr或者fetch去请求静态资源
        if (config.reportApiSpeed || config.reportAssetSpeed) {
            this.bindXhrEvent();
        }
        this.bindErrorEvent();
    }

    private bindXhrEvent() {
        cgiSpeed(this.onXhrResponse, this.onAssetResponse);
    }

    private bindAssetEvent() {
        assetSpeed(this.onAssetResponse);
    }

    private bindErrorEvent() {
        const orgError = window.onerror;
    
        // rewrite window.oerror
        window.onerror = (...args) => {
            this.onGlobalError(...args);
            orgError && orgError.call(window, ...args)
        }
    }

    startImageCollectTask = () => {
        // 这个方法还有待优化
        const task = function () {
            setTimeout(() => {
                const resources = performance.getEntriesByType("resource");

                const imgResource = [];
                const scriptResource = [];
                const cssResource = [];

                if(resources.length <= 0) {
                    task();
                } else {

                }
            }, 5000); // 第一版本 5s 收集一次， 如果有数据了，就停止，后面再调整这个策略， 包括后面的 JS 测速上报。
        };
    }

    // 请求返回时
    onXhrResponse = (data: SpeedLog) => {
        this.emit('onRecevieXhr', data);
    }

    onAssetResponse = (data: SpeedLog) => {
        this.emit('onRecevieAsset', data);
    }

    onEventResponse = (data: EventLog) => {
        this.emit('onRecevieEvent', data);
    }

    onGlobalError(msg: object | Event | string, target: string | undefined, rowNum: number | undefined, colNum: number | undefined, error: Error | undefined) {
        this.emit('onRecevieError', {
            msg,
            target,
            rowNum,
            colNum,
            error
        });
    }
}