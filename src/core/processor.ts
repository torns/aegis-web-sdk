import { SpeedLog, EventLog, NormalLog, LOG_TYPE, AegisConfig, ErrorMsg } from '../interface/log'; 
import InterceptorManager from '../helper/interceptors-manager';
import formatLog from '../interceptors/formatlog';
import ignore from '../interceptors/ignore';
import repeatLimit from '../interceptors/repeat-limit';
import lengthLimit from '../interceptors/length-limit';
import sampling from '../interceptors/sampling';
import { isOBJ, extend } from '../utils/index';

let instance: Processor;

export default class Processor{
    logInterceptor!: InterceptorManager
    constructor(config: AegisConfig) {
        if(instance) {
            return instance;
        } else {
            instance = this;
        }

        this.logInterceptor = new InterceptorManager();

        this.logInterceptor.use(formatLog());
        this.logInterceptor.use(sampling(config.random));
        this.logInterceptor.use(lengthLimit(config.maxLength));
        this.logInterceptor.use(repeatLimit(config.repeat));
        this.logInterceptor.use(ignore(config.ignore));
    }


    // 测速日志
    processSpeedLog(logs: SpeedLog) {

    }

    // 资源日志
    processAssetsLog(logs: SpeedLog) {

    }

    // 普通日志
    processNormalLog(_msg: any, logType: LOG_TYPE, success: Function, fail ?: Function) {
        const msg = isOBJ(_msg) ? extend({}, _msg, {
            level: logType
        }) : {
            msg: _msg
        };

        this.logInterceptor.run(msg, success, fail);
    }
}