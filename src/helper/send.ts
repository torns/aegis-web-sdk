import { isOBJ, isEmpty } from '../utils/index';

export function send (url: string, data ?: any) {
    if (navigator.sendBeacon && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon(url, data);
    } else {
        new Image().src = url;
    }
}

export function formatParams(data: any[]) {
    if (typeof data.join === 'undefined') {
        data = [data as any];  
    }

    const params: string[] = [];

    let count = 0;
    data.forEach((error, index) => {
        if (isOBJ(error)) {
            for (const key in error) {
                let value = error[key]
                if (!isEmpty(value)) {
                    if (isOBJ(value)) {
                        try {
                            value = JSON.stringify(value)
                        } catch (err) {
                            value = '[BJ_REPORT detect value stringify error] ' + err.toString()
                        }
                    }
                    params.push(key + '[' + count + ']=' + encodeURIComponent(value))
                }
            }
            count ++;
        }

    });

    return params.join('&') + `&count=${count}`;
}

export function sendOffline (url: string, data: string) {
    let iframe = document.createElement('iframe');
    iframe.name = 'badjs_offline_' + (Date.now() - 0);
    iframe.frameBorder = '0';
    iframe.height = '0';
    iframe.width = '0';
    iframe.src = 'javascript:false'

    iframe.onload = function () {
        const form = document.createElement('form')
        form.style.display = 'none'
        form.target = iframe.name
        form.method = 'POST'
        form.action = url + '/offlineLog'
        const input = document.createElement('input')
        input.style.display = 'none'
        input.type = 'hidden'
        input.name = 'offline_log'
        input.value = data

        if(iframe.contentDocument) {
            iframe.contentDocument.body.appendChild(form);
        }

        form.appendChild(input);
        form.submit();
        // console.log('report offline log success');
        setTimeout(function () {
            document.body.removeChild(iframe);
        }, 5000);

        iframe.onload = null;
    }
    document.body.appendChild(iframe);
}
