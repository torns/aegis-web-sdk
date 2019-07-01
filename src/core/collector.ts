import { SpeedLog, EventLog, NormalLog, LOG_TYPE, AegisConfig } from '../interface/log'; 
import overrideXhr from '../override/XMLHttpRequest';
import overrideFetch from '../override/fetch';
import { isOBJByType, formatStackMsg, formatError } from '../utils';
import EventEmiter from '../helper/event-emiter';
// 上报收集器

let instance: Collector;

export default class Collector extends EventEmiter {
    overrideXhr = overrideXhr;
    overrideFetch = overrideFetch;

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
        this.overrideXhr(this.onXhrResponse);
        this.overrideFetch(this.onXhrResponse);
    }

    // TODO 
    private bindImgEvent() {

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

    onGlobalError(msg: object | Event | string, url: string | undefined, row: number | undefined, col: number | undefined, error: Error | undefined) {
        this.emit('onRecevieError', {
            msg,
            url,
            row,
            col,
            error
        });
    }
}