import { SpeedLog } from '../interface/log';
import { formatUrl } from '../utils/log';

const CGI_INITIATOR_TYPE = ['fetch', 'xmlhttprequest'],
      ASSETS_INITIATOR_TYPE = ['img', 'css', 'script', 'link'],
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
        status: 200, // 200成功  400失败
    }
}

function startCollect(): void{
    if (colletcing) return;
    colletcing = true;

    // 加载成功的资源上报
    timer = setInterval(collect, 2000);

    // 加载失败的静态资源上报
    document.addEventListener('error', function aegisAssetsErrorHandler (event) {
        if (!event) return;
        const target: any = event.target || event.srcElement;
        const failedLog: SpeedLog = {
            url: formatUrl(target.src || target.href),
            status: 400
        }
        assetsLogEmitors.forEach(emit => {
            emit(failedLog);
        });
    }, true)

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