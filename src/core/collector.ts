import { SpeedLog, EventLog, NormalLog, LOG_TYPE, AegisConfig } from '../interface/log';
import { isOBJByType, formatStackMsg, formatError } from '../utils';
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
        cgiSpeed(this.onXhrResponse.bind(this));
    }

    private bindImgEvent() {
        imageSpeed(this.onImageResponse.bind(this));
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
    onXhrResponse(data: SpeedLog) {
        this.emit('onRecevieXhr', data);
    }

    onImageResponse(data: SpeedLog) {
        this.emit('onRecevieImage', data);
    }

    onEventResponse(data: EventLog) {
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