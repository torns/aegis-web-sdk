import { isOBJ, processError, extend, buildParam } from './utils/index';
import send from './report';


const _config = {
    id: 0, // 上报 id
    uin: 0, // user id
    url: '//now.qq.com/badjs', // 上报接口
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
    offlineLog: true,
    offlineLogExp: 3, // 离线日志过期时间，默认3天
    offlineLogAuto: true, // 是否自动询问服务器需要自动上报
    deflate: false, // 是否使用压缩算法
    onReport: () => {
    }, // 与上报同时触发，用于统计相关内容
    beforeReport: () => {
        return true
    } // aop：上报前执行，如果返回 false 则不上报
}


// export const wardjs = new WardjsReportSpeed({
//     url: '//now.qq.com/badjs',
//     id: 525,
//     uin: 111111,
//     version: 3,
//     from: location.href,
//     onReport: function (bid, reportLog) {
//         console.log(bid, reportLog);
//     },
//     beforeReport: function (reportLog) {
//         return true;
//     }
// });

class WardjsReportSpeed {
    constructor(props) {
        // this._init()
        this.props = props;
    }

    _init(params) {
        this._initConfig(extend(this.props, params));
        if (performance === undefined) {
            console.log('= Calculate Load Times: performance NOT supported');
            return;
        }

        // Get a list of "resource" performance entries
        var resources = performance.getEntriesByType('resource');
        if (resources === undefined || resources.length <= 0) {
            console.log('= Calculate Load Times: there are NO `resource` performance records');
            return;
        }

        var sendObj = {};
        resources.forEach((element) => {
            var name = element.name;
            sendObj[element.initiatorType].push({ name: element.duration });
        });

        console.log(sendObj);
    }

    // 初始化参数
    _initConfig(props) {
        for (const key in _config) {
            if (key in props) {
                _config[key] = props[key];
            }
        }
        const id = parseInt(_config.id, 10);
        if (id) {
            // if (/qq\.com$/gi.test(location.hostname)) {
            //     if (!_config.url) {
            //         _config.url = '//now.qq.com/badjs'
            //     }
            //
            //     if (document && document.cookie && !_config.uin) {
            //         _config.uin = parseInt((document.cookie.match(/\buin=\D+(\d+)/) || [])[1], 10)
            //     }
            // }

            _config._reportUrl = (_config.url || '//now.qq.com/badjs') +
                '?id=' + id +
                '&uin=' + _config.uin +
                '&version=' + _config.version +
                // '&from=' + encodeURIComponent(location.href) +
                '&';
            // pv
            send(`${_config.url}/${id}`);
        }
        for (const key in _config) {
            this[key] = _config[key];
        }
    }

    // 将错误推到缓存池
    _push(msg, immediately) {
        const data = isOBJ(msg) ? processError(msg) : {
            msg: msg
        };

        // ext 有默认值, 且上报不包含 ext, 使用默认 ext
        if (this.ext && !data.ext) {
            data.ext = this.ext;
        }
        // 在错误发生时获取页面链接
        // https://github.com/BetterJS/badjs-report/issues/19
        if (!data.from) {
            data.from = this.from || 'qb://ext/nolive';
        }

        if (data._orgMsg) {
            delete data._orgMsg;
            data.level = 2;
            const newData = extend({}, data);
            newData.level = 4;
            newData.msg = data.msg;
            logList.push(data);
            logList.push(newData);
        } else {
            logList.push(data);
        }

        this._processLog(immediately);
        return this;
    }

    changeUin(uin) {
        this.uin = uin;
        this.props.uin = uin;
        this.log.changeUin(uin);
    }

    // 上报错误事件
    report(msg, isReportNow) {
        msg && this._push(msg, isReportNow);
        return this;
    }

    // 上报 info 事件
    info(msg) {
        if (!msg) {
            return this;
        }
        if (isOBJ(msg)) {
            msg.level = 2;
        } else {
            msg = {
                msg: msg,
                level: 2
            };
        }
        this._push(msg);
        return this;
    }

    // 上报 debug 事件
    debug(msg) {
        if (!msg) {
            return this;
        }
        if (isOBJ(msg)) {
            msg.level = 1;
        } else {
            msg = {
                msg: msg,
                level: 1
            };
        }
        this._push(msg);
        return this;
    }

    // 增加离线日志
    addOfflineLog(msg) {
        if (!msg) {
            return this;
        }
        if (isOBJ(msg)) {
            msg.level = 20;
        } else {
            msg = {
                msg: msg,
                level: 20
            };
        }
        this._push(msg);
        return this;
    }

    // 用于统计上报
    static monitor(n, monitorUrl = '//report.url.cn/report/report_vm') {
        // 如果n未定义或者为空，则不处理
        if (typeof n === 'undefined' || n === '') {
            return;
        }

        // 如果n不是数组，则将其变成数组。注意这里判断方式不一定完美，却非常简单
        if (typeof n.join === 'undefined') {
            n = [n];
        }

        const p = {
            monitors: '[' + n.join(',') + ']',
            _: Math.random()
        };

        if (monitorUrl) {
            let _url = monitorUrl + (monitorUrl.match(/\?/) ? '&' : '?') + buildParam(p);

            send(_url);
        }
    }
}

