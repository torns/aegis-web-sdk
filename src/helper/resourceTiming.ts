import { SpeedLog } from '../interface/log'; 

const IMG_INITIATOR_TYPE = ['img', 'css'],
      CGI_INITIATOR_TYPE = ['fetch', 'xmlhttprequest'],
      imgLogEmitors: Function[] = [],
      cgiLogEmitors: Function[] = [];

let colletcing: boolean = false,
    timer: number;

function collect(): void{
    const entries: PerformanceResourceTiming[] = performance.getEntriesByType('resource') as PerformanceResourceTiming[] || [];
    performance.clearResourceTimings();
    for(let i = 0, l= entries.length; i < l; i++) {
        const entry = entries[i];
        if (IMG_INITIATOR_TYPE.indexOf(entry.initiatorType) > 0) {
            imgLogEmitors.forEach(emit => {
                emit(generateLog(entry));
            });
        }
        if (CGI_INITIATOR_TYPE.indexOf(entry.initiatorType) > 0) {
            imgLogEmitors.forEach(emit => {
                emit(generateLog(entry));
            });
        }
    }
}

function generateLog(entry: PerformanceResourceTiming): SpeedLog{
    return {
        url: entry.name, // 请求地址,
        method: 'get', //请求方法
        openTime: 0,   // 请求开始时的时间戳,
        sendTime: 0,   // 请求发送时的时间戳
        responseTime: 0, // 请求返回时的时间戳
        duration: entry.duration, // 耗时
        ret: 0, // cgi 的状态码，如果是图片或其他的，默认为 0 
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
    getImageLog(emit: Function): void {
        startCollect();
        imgLogEmitors.push(emit);
    },
    getCgiLog(emit: Function): void {
        startCollect();
        cgiLogEmitors.push(emit);
    },
    stopCollect
}