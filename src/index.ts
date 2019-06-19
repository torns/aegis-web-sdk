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

        imageSpeed.observe(this.logPipe);
        cgiSpeed.observe(this.logPipe);
    }

    // 离线日志
    reportOfflineLog = () => {
    }

    // TODO 上报
    report = () => {

    }
    
    logPipe = (log: SpeedLog) => {
        console.log(log);
    }
}

export default Aegis;

(<any>window).Aegis = Aegis; // 挂载window 暴露