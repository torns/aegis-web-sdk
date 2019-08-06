import { SpeedLog } from '../interface/log';
import { formatUrl } from '../utils';

let alreadyOverride: boolean = false;

export default function overrideFetch(notify: Function) {
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
                // TODO 根据content-type判断请求的是否是cgi
                // res.headers.get('content-type');
                speedLog.duration = Date.now() - sendTime;
    
                notify && notify(speedLog);
            }catch(err){}
            return res;
        })

        return fetchPromise;
    }
}