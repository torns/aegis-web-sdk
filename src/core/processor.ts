import { SpeedLog, EventLog, NormalLog, LOG_TYPE, AegisConfig, ErrorMsg } from '../interface/log'; 
import InterceptorManager from '../helper/interceptors-manager';
import ignore from '../interceptors/ignore';
import repeatLimit from '../interceptors/repeat-limit';
import lengthLimit from '../interceptors/length-limit';
import sampling from '../interceptors/sampling';

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

        this.logInterceptor.use(sampling(config.random));
        this.logInterceptor.use(lengthLimit(config.maxLength));
        this.logInterceptor.use(repeatLimit(config.repeat));
        this.logInterceptor.use(ignore(config.ignore));
    }

    // 错误日志
    processErrorLog(msg: string | Error, logType = LOG_TYPE.ERROR, success: Function, fail ?: Function) {
        msg.level = logType;
        this.logInterceptor.run(msg, success, fail);
    }

    // 测速日志
    processSpeedLog(logs: SpeedLog) {

    }

    // 资源日志
    processAssetsLog(logs: SpeedLog) {

    }

    // 普通日志
    processNormalLog(msg: string | ErrorMsg, logType: LOG_TYPE, success: Function, fail ?: Function) {
        const data = isOBJ(msg) ? processError(msg) : {
            msg: msg
        }

        data.level = logType;
        this.logInterceptor.run(data, success, fail);
    }
}