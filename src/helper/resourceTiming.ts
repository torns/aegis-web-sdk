import { SpeedLog } from '../interface/log';
import { formatUrl } from '../utils/log';

const CGI_INITIATOR_TYPE = ['fetch', 'xmlhttprequest'],
      ASSETS_INITIATOR_TYPE = ['img', 'css', 'script'],
      assetsLogEmitors: Function[] = [],
      cgiLogEmitors: Function[] = [];

let colletcing: boolean = false,
    timer: number;

function collect(): void{
    const entries: PerformanceResourceTiming[] = performance.getEntriesByType('resource') as PerformanceResourceTiming[] || [];
    performance.clearResourceTimings();
    for(let i = 0, l= entries.length; i < l; i++) {
        const entry = entries[i];
        if (ASSETS_INITIATOR_TYPE.indexOf(entry.initiatorType) > -1) {
            assetsLogEmitors.forEach(emit => {
                emit(generateLog(entry));
            });
        }
        if (CGI_INITIATOR_TYPE.indexOf(entry.initiatorType) > -1) {
            cgiLogEmitors.forEach(emit => {
                emit(generateLog(entry));
            });
        }
    }
}

function generateLog(entry: PerformanceResourceTiming): SpeedLog{
    // const timeOrigin = performance.timeOrigin;
    return {
        url: formatUrl(entry.name), // 请求地址,
        method: 'get', //请求方法
        duration: entry.duration, // 耗时
        // ret: 0, // cgi 的状态码，如果是图片或其他的，默认为 0 
        status: 200, // http 返回码
    }
}

function startCollect(): void{
    if (colletcing) return;
    colletcing = true;

    timer = setInterval(collect, 2000);

    performance.onresourcetimingbufferfull = collect;
}

function stopCollect(): void{
    colletcing = false;
    timer && clearInterval(timer);
}

export default {
    getAssetsLog(emit: Function): void {
        startCollect();
        assetsLogEmitors.push(emit);
    },
    getCgiLog(emit: Function): void {
        startCollect();
        cgiLogEmitors.push(emit);
    },
    stopCollect
}