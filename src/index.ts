import overrideXhr from './override/overrideXhr';
import overrideFetch from './override/overrideFetch';

class Aegis{
    private static instance: Aegis;

    _config = {
        id: '', // 项目id
    }

    data = [] // 等待上报的

    overrideXhr = overrideXhr;
    overrideFetch = overrideFetch;

    constructor(opts) {
        if(Aegis.instance) {
            return Aegis.instance;
        }

        if(!opts.id) {
            console.error('not define aegis project id, init fail');
            return;
        }

        this._config = opts;

        this._bindXhrEvent();
    }

    _bindXhrEvent() {
        this.overrideXhr();
        this.overrideFetch();
    }

    // 离线日志
    _offlineLog = () => {
    }

    // TODO 上报
    _report = () => {

    }

    // 请求返回时
    onResponse(Resource) {

    }
}

export default Aegis;

(<any>window).Aegis = Aegis; // 挂载window 暴露