import { SpeedLog, EventLog, NormalLog, LOG_TYPE, ErrorMsg } from '../interface/log'; 
import { AegisConfig } from '../interface/config';
import InterceptorManager from '../helper/interceptors-manager';
import formatLog from '../interceptors/formatlog';
import ignore from '../interceptors/ignore';
import repeatLimit from '../interceptors/repeat-limit';
import lengthLimit from '../interceptors/length-limit';
import sampling from '../interceptors/sampling';
import { isOBJ, extend } from '../utils/index';
import imageIgnore from '../interceptors/image-ignore';
import restful from '../interceptors/restful';
// import beforeReport from '../interceptors/beforeReport';


export default class Processor{
    logInterceptor!: InterceptorManager
    speedInterceptor!: InterceptorManager
    constructor(config: AegisConfig) {
        this.logInterceptor = new InterceptorManager();

        this.logInterceptor.use(formatLog());
        this.logInterceptor.use(sampling(config.random));
        this.logInterceptor.use(lengthLimit(config.maxLength));
        this.logInterceptor.use(repeatLimit(config.repeat));
        this.logInterceptor.use(ignore(config.ignore));
        // this.logInterceptor.use(beforeReport(config));

        this.speedInterceptor = new InterceptorManager();
        this.speedInterceptor.use(imageIgnore());
        this.speedInterceptor.use(restful(config.restfulApiList));
    }


    // 测速日志
    processSpeedLog(logs: SpeedLog, success: Function, fail ?: Function) {
        this.speedInterceptor.run(logs, success, fail);
    }

    // 资源日志
    processAssetsLog(logs: SpeedLog) {

    }

    // 普通日志
    processNormalLog(_msg: any, logType: LOG_TYPE, success: Function, fail ?: Function) {
        let msg;
        if (_msg instanceof Error) {
            msg = {error: _msg};
        } else if (isOBJ(_msg)) {
            msg = extend({}, _msg, {
                level: logType
            });
        } else {
            msg = {
                msg: _msg,
                level: logType
            };
        }

        this.logInterceptor.run(msg, success, fail);
    }
}