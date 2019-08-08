import { SpeedLog } from '../interface/log';
import { formatUrl } from '../utils';

let alreadyOverride: boolean = false;

export default function overrideFetch(emitCgi: Function, emitAsset: Function) {
    if(alreadyOverride) return;
    alreadyOverride = true;

    const originFetch = (<any>window).fetch;

    (<any>window).fetch = function() {
        const args = Array.prototype.slice.call(arguments);
        
        const speedLog: SpeedLog = {
            url: formatUrl(args[0]),
            method: args[1] ? args[1].method || 'get' : 'get'
        };
        const sendTime = Date.now();

        const fetchPromise = originFetch(...args);

        fetchPromise.then(function(res: any){
            try {
                speedLog.duration = Date.now() - sendTime;
    
                // 根据content-type判断请求的是否是cgi
                const contentType = res.headers.get('content-type');
                if (contentType.indexOf('json') !== -1) {
                    // cgi
                    emitCgi && emitCgi(speedLog);
                } else {
                    // 图片或者js
                    emitAsset && emitAsset(speedLog);
                }
            }catch(err){}
            return res;
        })

        return fetchPromise;
    }
}