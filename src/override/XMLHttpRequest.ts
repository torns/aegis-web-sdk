import { SpeedLog } from '../interface/log';

let alreadyOverride: boolean = false;

export default function overrideXhr(notify: Function) {
    if(alreadyOverride) return;
    alreadyOverride = true;

    const xhrProto = (<any>window).XMLHttpRequest.prototype,
    originOpen = xhrProto.open,
    originSend = xhrProto.send;

    //改写open
    xhrProto.open = function(method: string, url: string) {
        const xhr = this,
              args = arguments;
        
        xhr.speedLog = {
            url,
            method,
            openTime: Date.now()
        } as SpeedLog;
        
        xhr.addEventListener('readystatechange', function() {
            if(xhr.readyState === 4) {
                xhr.speedLog.responseTime = Date.now();
                xhr.speedLog.duration = xhr.speedLog.responseTime - xhr.speedLog.sendTime;

                notify && notify(xhr.speedLog);
            }
        })

        return originOpen.apply(xhr, args);
    }

    // //改写send
    xhrProto.send = function() {
        const xhr = this;

        xhr.speedLog.sendTime = Date.now();

        return originSend.apply(xhr, arguments);
    }
}