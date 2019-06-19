import { SpeedLog, EventLog, NormalLog, LOG_TYPE, AegisConfig } from '../interface/log'; 
import overrideXhr from '../override/overrideXhr';
import overrideFetch from '../override/overrideFetch';
import { isOBJByType, formatStackMsg } from '../utils';
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

    onGlobalError(msg: object | Event | string, url: string | undefined, line: number | undefined, col: number | undefined, error: Error | undefined) {
        let newMsg = '';

        if (error && error.stack) {
            newMsg = formatStackMsg(error);
        }

        if (isOBJByType(newMsg, 'Event')) {
            const eventMsg = msg as Event;
            newMsg += eventMsg.type
                ? ('--' + eventMsg.type + '--' + (eventMsg.target
                    ? (eventMsg.target.tagName + '::' + eventMsg.target.src) : '')) : ''
        } else {
            newMsg = msg as string;
        }

        this.emit('onRecevieError', {
            msg: newMsg,
            target: url,
            rowNum: line,
            colNum: col
        });
    }
}