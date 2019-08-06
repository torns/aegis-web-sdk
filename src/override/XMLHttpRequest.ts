import { SpeedLog } from '../interface/log';
import { formatUrl } from '../utils';

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
            url: formatUrl(url),
            method
        } as SpeedLog;

        const sendTime = Date.now();
        xhr.addEventListener('readystatechange', function() {
            if(xhr.readyState === 4) {
                xhr.speedLog.duration = Date.now() - sendTime;

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