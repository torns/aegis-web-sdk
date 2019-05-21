import AegisCgiSpeed from '../index';

export default function overrideXhr(this: AegisCgiSpeed) {
    const xhrProto = (<any>window).XMLHttpRequest.prototype,
          originOpen = xhrProto.open,
          originSend = xhrProto.send;
          
    xhrProto.open = function(method: string, url: string) {
        const xhr = this,
              args = arguments;
        xhr.addEventListener('readystatechange', () => {
            console.log(args);
        })
        originOpen.apply(xhr, args);
    }
    xhrProto.send = function() {
        const xhr = this;
        console.log('send');
        originSend.apply(xhr, arguments);
    }
}