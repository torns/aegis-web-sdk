import { SpeedLog, EventLog, NormalLog, LOG_TYPE, AegisConfig, ErrorMsg } from '../interface/log'; 
import Collector from './collector';
import Processor from './processor';
import OfflineLog from '../helper/offlinelog';
import { send, formatParams } from '../helper/send';
import { extend } from '../utils/index';

let instance: Reporter;

const baseConfig: AegisConfig = {
    id: 0, // 上报 id
    uin: 0, // user id
    url: '//aegis.qq.com/badjs', // 上报接口
    version: 0,
    ext: null, // 扩展参数 用于自定义上报
    level: 4, // 错误级别 1-debug 2-info 4-error
    ignore: [], // 忽略某个错误, 支持 Regexp 和 Function
    random: 1, // 抽样 (0-1] 1-全量
    delay: 1000, // 延迟上报
    maxLength: 500, // 每条日志内容最大长度，通常不建议修改
    submit: null, // 自定义上报方式
    monitorUrl: '//report.url.cn/report/report_vm', // 自定义统计上报地址
    repeat: 5, // 重复上报次数(对于同一个错误超过多少次不上报),
    offlineLog: false,
    offlineLogExp: 3, // 离线日志过期时间，默认3天
    offlineLogAuto: false // 是否自动询问服务器需要自动上报
}

export class Reporter {
    // 日志的缓存池
    private eventLog: EventLog[] = [] // 等待上报的日志
    private speedLog: SpeedLog[] = [] // 等待上报的日志
    private imageLog: SpeedLog[] = [] // 等待上报的日志
    private normalLog: NormalLog[] = [] //等待上报的日志

    private _config!: AegisConfig
    private _collector!: Collector
    private _processor!: Processor
    private _offlineLog!: OfflineLog
    private _reportUrl!: string
    private _reportTask!: number

    constructor(config: AegisConfig) {
        if(instance) {
            return instance;
        } else {
            instance = this;
        }

        this._config = extend(baseConfig, config) as AegisConfig;

        const id = parseInt(config.id as string, 10);

        if (id) {
            if (/qq\.com$/gi.test(location.hostname)) {
                if (!config.url) {
                    config.url = '//aegis.qq.com/badjs'
                }

                if (!config.uin) {
                    config.uin = parseInt((document.cookie.match(/\buin=\D+(\d+)/) || [])[1], 10)
                }
            }

            this._reportUrl = (config.url || '//aegis.qq.com/badjs') +
                '?id=' + id +
                '&uin=' + this._config.uin +
                '&version=' + this._config.version +
                // '&from=' + encodeURIComponent(location.href) +
                '&'
        } else {
            console.error('please check badjsid!!!')
            return;
        }

        this.reportPv();

        this._config = config;

        this._collector = new Collector(config);
        this._processor = new Processor(config);
        
        this._offlineLog = new OfflineLog();
        

        this._collector.on('onRecevieError', this.handlerRecevieError);
        this._collector.on('onRecevieXhr', this.handlerRecevieXhr)
        this._collector.on('onRecevieImage', this.handlerRecevieImage);
    }

    reportPv() {
        send(`${this._config.url}/${this._config.id}`);
    }

    handlerRecevieError = (data) => {
        debugger;
        this.error(data, true);
    }

    handlerRecevieXhr = (data) => {

    }

    handlerRecevieImage = (data) => {

    }
    
    submitLog = (msg: any[] | any) => {
        const _url = this._reportUrl + formatParams(msg) + '&_t=' + (+new Date());

        send(_url);
    }

    startReportTask = (msg: NormalLog) => {
        this.normalLog.push(msg);

        if(this._reportTask) {
            return;
        }

        this._reportTask = setTimeout(() => {
            this.submitLog(this.normalLog);
            this._reportTask = 0; // clear task
            this.normalLog = []; // clear pool 
        }, this._config.delay);
    }
    // TODO
    report = (msg: any, immediately = false) => {
        const {
            id,
            onReport,
            offlineLog
        } = this._config;

        if(offlineLog) {
            const offline = this._offlineLog;

            // 默认全部写入离线日志
            const prefix = 'badjs_' + this._config.id + this._config.uin;
            offline.save2Offline(prefix, msg, this._config);
        }
        
        if (immediately) {
            this.submitLog(msg); // 立即上报
        } else {
            this.startReportTask(msg);
        }

        if(onReport) {
            onReport(id, msg);
        }
    }

    debug (msg: any, immediately = false) {
        if(this._config.isDebug) {
            return;
        }

        this._processor.processNormalLog(msg, LOG_TYPE.DEBUG, (_msg: NormalLog) => {
            debugger;
            this.report(_msg, immediately);
        }, (err: any) => {
            // TODO 
        });
    }

    info = (msg: any, immediately = false) => {
        this._processor.processNormalLog(msg, LOG_TYPE.INFO, (_msg: NormalLog) => {
            this.report(_msg, immediately);
        }, (err: any) => {
            // TODO 
        });
    }

    error = (msg: any, immediately = false) => {
        this._processor.processErrorLog(msg, LOG_TYPE.ERROR, (_msg: NormalLog) => {
            this.report(_msg, immediately);
        }, (err: any) => {
            // TODO 
        });
    }

    // 测速
    speed (event: string, time: number) {

    }
}