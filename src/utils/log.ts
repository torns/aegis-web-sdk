// 去掉query
const hasProtocol: RegExp = /^http(s)?:\/\//igm;
export function formatUrl (url: string) {
    if(typeof url === 'string') {
        // 补齐域名和协议
        let prefix: string = '';
        if(!hasProtocol.test(url)) {
            prefix = location.protocol + '//';
        }
        if(url.indexOf(location.host) === -1) {
            prefix = prefix + location.host;
        }
        url = prefix + url;

        return url.split('?')[0];
    }else {
        return url;
    }
}

export function urlIsHttps (url: string) : boolean {
    return (/^https/).test(url);
}