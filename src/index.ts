import overrideXhr from './override/overrideXhr';
import overrideFetch from './override/overrideFetch';
import { SpeedLog } from './interface/log'; 

interface AegisConfig {
    id: number | string
}

class Aegis{
    private static instance: Aegis;

    private _config: AegisConfig

    private data = [] // 等待上报的

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

    // 离线日志
    reportOfflineLog = () => {
    }

    // TODO 上报
    report = () => {

    }

    // 请求返回时
    onResponse(data: SpeedLog) {

    }
}

export default Aegis;

(<any>window).Aegis = Aegis; // 挂载window 暴露