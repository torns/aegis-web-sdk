import { SpeedLog } from '../interface/log';
import { formatUrl } from '../utils/log';

let alreadyOverride: boolean = false;

export default function overrideXhr(emitCgi: Function, emitAsset: Function) {
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
            method
        } as SpeedLog;

        const sendTime = Date.now();
        xhr.addEventListener('readystatechange', function() {
            if(xhr.readyState === 4) {
                xhr.speedLog.url = formatUrl(xhr.responseURL);
                xhr.speedLog.duration = Date.now() - sendTime;
                xhr.speedLog.status = xhr.status === 200 ? 200 : 400;
                
                // 根据content-type判断请求的是否是cgi
                const contentType = xhr.getResponseHeader('content-type');
                if (typeof contentType !== 'string') return;

                if (contentType.toLowerCase().indexOf('json') !== -1) {
                    // cgi
                    emitCgi && emitCgi(xhr.speedLog);
                } else {
                    // 静态资源
                    emitAsset && emitAsset(xhr.speedLog);
                }
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