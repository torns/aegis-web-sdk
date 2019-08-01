import { SpeedLog, EventLog, NormalLog, LOG_TYPE, AegisConfig } from '../interface/log';
import { isOBJByType, formatStackMsg } from '../utils';
import EventEmiter from '../helper/event-emiter';
import cgiSpeed from '../helper/cgiSpeed';
import imageSpeed from '../helper/imageSpeed';
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
        
        this.bindXhrEvent();
        this.bindImgEvent();
        this.bindErrorEvent();
    }

    private bindXhrEvent() {
        cgiSpeed(this.onXhrResponse);
    }

    private bindImgEvent() {
        imageSpeed(this.onImageResponse);
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

    onImageResponse = (data: SpeedLog) => {
        this.emit('onRecevieImage', data);
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