import { SpeedLog } from './interface/log'; 
import imageSpeed from './log/imageSpeed';
import cgiSpeed from './log/cgiSpeed';

interface AegisConfig {
    id: number | string
}

class Aegis{
    private _config?: AegisConfig

    private data:[] = [] // 等待上报的

    constructor(opts: AegisConfig) {
        if(!opts || !opts.id) {
            console.error('not define aegis project id, init fail');
            return;
        }

        this._config = opts;

        // 订阅图片测速日志
        imageSpeed.observe(this.logPipe);
        // 订阅cgi测速日志
        cgiSpeed.observe(this.logPipe);
    }

    // 离线日志
    reportOfflineLog = () => {
    }

    // TODO 上报
    report = () => {

    }
    
    // 获取日志pipe
    logPipe = (log: SpeedLog) => {
        console.log(log);
    }
}

export default Aegis;

(<any>window).Aegis = Aegis; // 挂载window 暴露