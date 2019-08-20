import { SpeedLog, EventLog, NormalLog, LOG_TYPE } from '../interface/log';
import { AegisConfig } from '../interface/config';
import { isOBJByType, formatStackMsg, canUseResourceTiming } from '../utils';
import EventEmiter from '../helper/event-emiter';
import cgiSpeed from '../helper/cgiSpeed';
import assetSpeed from '../helper/assetSpeed';
import resourceTiming from '../helper/resourceTiming';
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
        if (canUseResourceTiming()) {
            resourceTiming.getAssetsLog(this.onAssetResponse);
        }
        // assetSpeed(this.onAssetResponse);
    }

    private bindErrorEvent() {
        const orgError = window.onerror;
    
        // rewrite window.oerror
        window.onerror = (...args) => {
            this.onGlobalError(...args);
            orgError && orgError.call(window, ...args)
        }
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