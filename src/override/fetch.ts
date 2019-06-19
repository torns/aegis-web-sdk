
import { SpeedLog } from '../interface/log';

const originFetch = (<any>window).fetch;
export default function overrideFetch(callback: Function) {

    (<any>window).fetch = function() {
        const args = Array.prototype.slice.call(arguments);
        
        const speedLog: SpeedLog = {
            url: args[0],
            method: args[1] ? args[1].method || 'get' : 'get',
            openTime: Date.now(),
            sendTime: Date.now()
        };

        const fetchPromise = originFetch(...args);

        fetchPromise.then(function(res: any){
            speedLog.responseTime = Date.now();
            speedLog.duration = speedLog.responseTime - speedLog.sendTime;

            callback(speedLog);
            return res;
        })

        return fetchPromise;
    }
}