import { buildParam } from '../utils/index';

export default function (n: any, monitorUrl = '//report.url.cn/report/report_vm') {
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
    }

    if (monitorUrl) {
        let _url = monitorUrl + (monitorUrl.match(/\?/) ? '&' : '?') + buildParam(p);

        new Image().src = _url;
    }
}