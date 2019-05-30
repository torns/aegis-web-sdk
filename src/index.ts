import overrideXhr from './override/overrideXhr';
import overrideFetch from './override/overrideFetch';
import { SpeedLog, EventLog } from './interface/log'; 
import { extend } from './utils';

interface AegisConfig {
    id: number | string,
    uin: number | string
}

function send(url: string, data: object) {
    const img = new Image();

    const payload = encodeURIComponent(JSON.stringify(data));

    img.src = `${url}?payload=${payload}`;
}

const BASE_URL = 'http://aegis.qq.com/aegis/speed';

class Aegis{
    private version = '0.0.1'
    private delay = 3000;
    private static instance: Aegis;

    private _config: AegisConfig = {
        id: '',
        uin: ''
    }

    private reportTimer: number = 0

    private eventLog: EventLog[] = [] // 等待上报的日志
    private speedLog: SpeedLog[] = [] // 等待上报的日志
    private imageLog: SpeedLog[] = [] // 等待上报的日志

    overrideXhr = overrideXhr;
    overrideFetch = overrideFetch;

    constructor(opts: AegisConfig) {
        if(Aegis.instance) {
            return Aegis.instance;
        }

        if(!opts.id) {
            console.error('not define aegis project id, init fail');
            return;
        }

        this._config = opts;

        this.bindXhrEvent();

        //TODO bind
    }

    private bindXhrEvent() {
        this.overrideXhr();
        this.overrideFetch();
    }

    // TODO 
    private bindImgEvent() {

    }

    setConfig = (obj: object) => {
        extend(this._config, obj);
    }

    processData = () => {
        return {
            id: this._config.id,
            uin: this._config.uin,
            from: location.href,
            version: this.version,
            duration: {
                script: [this.speedLog]
            }
        }
    }

    // 离线日志
    reportOfflineLog = () => {
    }

    // TODO event 上报
    report = (immediately = false) => {
        if(this.reportTimer) {
            return;
        }

        this.reportTimer = setTimeout(() => {
            send(BASE_URL, this.processData());

            this.imageLog = [];
            this.speedLog = [];
            this.eventLog = [];

            this.reportTimer = 0;
        }, this.delay);
    }

    addSpeedLog(data: SpeedLog) {
        this.speedLog.push(data);
    }

    addImageLog(data: SpeedLog) {
        this.imageLog.push(data);
    }

    // 请求返回时
    onXhrResponse(data: SpeedLog) {
        this.addSpeedLog(data);
        this.report();
    }

    onImageResponse(data: SpeedLog) {
        this.addImageLog(data);
        this.report();
    }

    onEventResponse() {

    }
}

export default Aegis;

(<any>window).Aegis = Aegis; // 挂载window 暴露