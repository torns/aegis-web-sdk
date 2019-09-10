import { SpeedLog, EventLog, NormalLog, LOG_TYPE, ErrorMsg } from '../interface/log'; 
import { AegisConfig } from '../interface/config';
import Collector from './collector';
import Processor from './processor';
import sendPerformance from '../helper/performance';
import OfflineLog from '../helper/offlinelog';
import monitor from '../helper/monitor';
import { send, formatParams, sendOffline } from '../helper/send';
import { extend, getAid } from '../utils/index';

const baseConfig: AegisConfig = {
    id: 0, // 上报 id
    uin: 0, // user id
    isWhiteList: false,
    reportApiSpeed: false, // 是否上报api测速
    reportAssetSpeed: false, // 是否上报静态资源测速
    url: '//aegis.qq.com/badjs', // 上报接口
    speedUrl: '//aegis.qq.com/speed', // 上报测速数据接口
    performanceUrl: '//aegis.qq.com/speed/performance', // 上报性能监控接口
    version: 0, // 用户自定义业务版本号
    ext: null, // 扩展参数 用于自定义上报
    level: 4, // 错误级别 1-debug 2-info 4-error
    ignore: [], // 忽略某个错误, 支持 Regexp 和 Function
    random: 1, // 抽样 (0-1] 1-全量
    delay: 1000, // 延迟上报
    maxLength: 500, // 每条日志内容最大长度，通常不建议修改
    monitorUrl: '//aegis.qq.com/monitor', // 自定义统计上报地址
    repeat: 5, // 重复上报次数(对于同一个错误超过多少次不上报),
    offlineLog: false, // 是否开启离线日志
    offlineLogExp: 3, // 离线日志过期时间，默认3天
    offlineLogAuto: false, // 是否自动询问服务器需要自动上报
    assetLogFullSize: 20, // 静态资源等待上报日志的最大量，当超过这个量会立即上报
    restfulApiList: [] // 列出restful接口，将对这些接口归并上报
}

export class Reporter {
    // 日志的缓存池
    private speedLog: SpeedLog[] = [] // 等待上报的日志
    private assetLog: SpeedLog[] = [] // 等待上报的日志
    private normalLog: NormalLog[] = [] //等待上报的日志

    private _config!: AegisConfig
    private _collector!: Collector
    private _processor!: Processor
    private _offlineLog!: OfflineLog
    private _reportUrl!: string
    private _speedReportUrl!: string
    private startImageReportTask !: Function
    private startSpeedReportTask !: Function
    private startReportTask !: Function

    constructor(config?: AegisConfig) {
        this.setConfig(config);

        this._collector = new Collector(this._config);
        this._processor = new Processor(this._config);
        
        if (this._config.offlineLog) {
            this._initOffline();
        }

        this.reportPv();
        this.sendPerformance();

        this._collector.on('onRecevieError', this.handlerRecevieError);
        this._collector.on('onRecevieXhr', this.reportSpeedLog)
        this._collector.on('onRecevieAsset', this.reportAssetLog);


        this.startReportTask = this.createReportTask(this.normalLog, this.submitLog);
        this.startImageReportTask = this.createReportTask(this.assetLog, this.submitImageLog);
        this.startSpeedReportTask = this.createReportTask(this.speedLog, this.submitSpeedLog);
    }

    setConfig = (config: AegisConfig) => {
        this._config = extend({}, baseConfig, this._config, config) as AegisConfig;

        const id = parseInt(this._config.id as string, 10);

        if (!id) {
            console.error('aegis 初始化失败 未传入项目id');
            return;
        }

        if (!this._config.url) {
            console.warn('日志上报地址url不能设置为空');
            this._config.url = '//aegis.qq.com/badjs';
        }

        if (!this._config.speedUrl) {
            console.warn('测速上报地址speedUrl不能设置为空');
            this._config.speedUrl = '//aegis.qq.com/speed';
        }

        if (!this._config.uin) {
            try {
                this._config.uin = parseInt((document.cookie.match(/\buin=\D+(\d+)/) || [])[1], 10) || 0;
            }catch(e) {}
        }

        // TODO不能每次setconfig都重新配置aid
        getAid().then((aid) => {
            this._config.aid = aid;
            this._reportUrl += `&aid=${aid}`;
        });

        this._reportUrl = `${this._config.url}?id=${id}&uin=${this._config.uin}&version=${this._config.version}&from=${encodeURIComponent(location.href)}`;
        this._speedReportUrl = this._config.speedUrl;

        return this._config;
    }

    reportPv() {
        send(`${this._config.url}/${this._config.id}`);
    }

    sendPerformance() {
        sendPerformance(this._config);
    }

    handlerRecevieError = (data: any) => {
        this.report(data, true);
    }
    
    /* 上报普通日志 */
    submitLog = (msg: any[]) => {
        const _url = this._reportUrl + '&' + formatParams(msg) + '&_t=' + (+new Date());

        send(_url);
    }

    /* 上报测速 */
    submitImageLog = (msg: any[]) => {
        const opts = {
            id: this._config.id,
            uin: this._config.uin,
            version: this._config.version,
            from: encodeURIComponent(location.href),
            duration: {
                static: msg
            }
        }

        const _url = this._speedReportUrl + '?payload=' + encodeURIComponent(JSON.stringify(opts));

        send(_url);
    }

    submitSpeedLog = (msg: any[]) => {
        const opts = {
            id: this._config.id,
            uin: this._config.uin,
            version: this._config.version,
            from: encodeURIComponent(location.href),
            duration: {
                fetch: msg
            }
        }

        const _url = this._speedReportUrl + '?payload=' + encodeURIComponent(JSON.stringify(opts));

        send(_url);
    }

    createReportTask <T>(msgStore: Array<T>, reportFunction: Function) {
        let msgList = msgStore;
        let timer = 0;
        return (msg: T) => {
            msgList.push(msg);

            if(timer) {
                return;
            }
    
            timer = setTimeout(() => {
                reportFunction(msgList);
                timer = 0; // clear task
                msgList.length = 0; // clear pool 
            }, this._config.delay);
        }
    }

    reportAssetLog = (msg: SpeedLog, immediately = false) => {
        this._processor.processSpeedLog(msg, (_msg:SpeedLog) => {
            const {
                id,
                onReport,
                offlineLog
            } = this._config;
            
            if (immediately || this.assetLog.length >= this._config.assetLogFullSize) {
                this.assetLog.push(msg);
                this.submitImageLog(this.assetLog); // 立即上报
                this.assetLog.length = 0;
            } else {
                this.startImageReportTask(msg);
            }
    
            if(onReport) {
                onReport(id, msg);
            }
        });
    }

    reportSpeedLog = (msg: SpeedLog, immediately = false) => {
        this._processor.processSpeedLog(msg, (_msg:SpeedLog) => {
            const {
                id,
                onReport
            } = this._config;
            
            if (immediately) {
                this.submitSpeedLog([msg]); // 立即上报
            } else {
                this.startSpeedReportTask(msg);
            }
    
            if(onReport) {
                onReport(id, msg);
            }
        });
    }

    debug (msg: any, immediately = false) {
        this._processNormalLog(msg, LOG_TYPE.DEBUG, immediately);
    }

    info (msg: any, immediately = false) {
        this._processNormalLog(msg, LOG_TYPE.INFO, immediately);
    }

    report (msg: any, immediately = false) {
        this._processNormalLog(msg, LOG_TYPE.ERROR, immediately);
    }

    _processNormalLog (msg: any, logType: number, immediately: boolean = false) {
        this._processor.processNormalLog(msg, logType, (_msg: NormalLog) => {
            this._report(_msg, immediately);
        }, (err: any) => {
            // TODO 
        });
    }

    // TODO
    _report (msg: any, immediately = false) {
        const {
            id,
            onReport,
            beforeReport,
            offlineLog
        } = this._config;
        if (beforeReport && beforeReport(msg) === false) {
            return
        }

        if(offlineLog) {
            const offline = this._offlineLog;

            // 默认全部写入离线日志
            const prefix = 'badjs_' + this._config.id + this._config.uin;

            offline.save2Offline(prefix, msg, this._config);
        }
        
        if (immediately) {
            this.submitLog([msg]); // 立即上报
        } else {
            this.startReportTask(msg);
        }

        if(onReport) {
            onReport(id, msg);
        }
    }

    // 用于统计上报
    static monitor = monitor

    monitor: any = monitor

    // 初始化离线数据库
    _initOffline = () => {
        this._offlineLog = new OfflineLog();

        this._offlineLog.ready((err: any) => {
            if (err) {
                return;
            }

            setTimeout(() => {
                this._offlineLog.clearDB(this._config.offlineLogExp);
                setTimeout(() => {
                    this._config.offlineLogAuto && this._autoReportOffline();
                }, 5000);
            }, 1000);
        });

        return this;
    }

    // 询问服务器是否上报离线日志
    _autoReportOffline = () => {
        const script = document.createElement('script');
        script.src = `${this._config.url}/offlineAuto?id=${this._config.id}&uin=${this._config.uin}`;
        // 通过 script 的返回值执行回调
        (<any>window)._badjsOfflineAuto = (secretKey: any) => {
            if (secretKey) {
                this.reportOfflineLog(secretKey)
            }
            document.head.removeChild(script);
        }
        document.head.appendChild(script);
    }

    // 上报离线日志
    reportOfflineLog = (secretKey: any) => {
        if (!window.indexedDB) {
            this.info('unsupport offlineLog')
            return
        }

        this._offlineLog.ready((err: any) => {
            if (err) {
                return;
            }

            const startDate = Date.now() - this._config.offlineLogExp * 24 * 3600 * 1000;
            const endDate = Date.now();
            this._offlineLog.getLogs({
                start: startDate,
                end: endDate,
                id: this._config.id,
                uin: this._config.uin
            }, (err: any, logs: any, msgObj: any, urlObj: any) => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log('offline logs length:', logs.length)
                const reportData = { logs, msgObj, urlObj, startDate, endDate, secretKey }

                const { id, uin, url } = this._config;
                const { userAgent } = navigator
        
                let data = JSON.stringify(extend(reportData, {
                    userAgent,
                    id,
                    uin
                }));
        
                const _url = url + '/offlineLog';
        
                sendOffline(_url, data)
            })
        })
    }
}