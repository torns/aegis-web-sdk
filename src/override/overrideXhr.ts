import AegisCgiSpeed from '../index';
import Resource from './Resource';

const xhrProto = (<any>window).XMLHttpRequest.prototype,
      originOpen = xhrProto.open,
      originSend = xhrProto.send;

export default function overrideXhr(this: AegisCgiSpeed) {
    const acs = this;

    //改写open
    xhrProto.open = function(method: string, url: string) {
        const xhr = this,
              args = arguments;

        Object.defineProperty(xhr, 'aegisResource', {
            value: new Resource({
                from: location.href,
                url: url,
                method: method
            }),
            enumerable: false,
            configurable: false
        })
        
        xhr.addEventListener('readystatechange', function() {
            xhr.aegisResource.onreadystatechange(xhr.readyState, acs);
        })

        xhr.aegisResource.open();
        return originOpen.apply(xhr, args);
    }

    //改写send
    xhrProto.send = function() {
        const xhr = this;
        xhr.aegisResource.send();
        return originSend.apply(xhr, arguments);
    }
}