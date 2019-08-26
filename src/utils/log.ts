// 去掉query
const hasProtocol: RegExp = /^http(s)?:\/\//igm;
export function formatUrl (url: string) {
    if(typeof url === 'string') {
        return url.split('?')[0];
    }else {
        return url;
    }
}

export function urlIsHttps (url: string) : boolean {
    return (/^https/).test(url);
}