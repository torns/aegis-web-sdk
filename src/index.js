import { isOBJ, processError, extend, buildParam } from './utils';
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
        return true;
    } // aop：上报前执行，如果返回 false 则不上报
};

export const wardjs = new WardjsReportSpeed({
    url: '//now.qq.com/badjs',
    id: 525,
    uin: 111111,
    version: 3,
    from: location.href,
    onReport: function (bid, reportLog) {
        console.log(bid, reportLog);
    },
    beforeReport: function (reportLog) {
        return true;
    }
});

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
            if (!sendObj[element.initiatorType]) {
                sendObj[element.initiatorType] = [];
            }

            sendObj[element.initiatorType].push({
                name: element.name,
                duration: element.duration
            });

        });

        const newData = extend(_config, { duration: sendObj });
        send(this.url, newData, 'post');
    }

    // 初始化参数
    _initConfig(props) {
        for (const key in _config) {
            if (key in props) {
                _config[key] = props[key];
            }
        }
        for (const key in _config) {
            this[key] = _config[key];
        }
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

var _onload = window.onload;

window.onload = function () {
    wardjs._init();
    if (_onload && typeof _onload === 'function') {
        console.log(_onload);
        _onload();
    }
};

