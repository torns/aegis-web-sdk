export function extend (...args: object[]): object { // .length of function is 2
    if (args.length === 0) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
    }

    let to = Object(args[0]);

    for (let index = 1; index < args.length; index++) {
        const nextSource = args[index] as any;

        if (nextSource != null) { // Skip over if undefined or null
            for (let nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}

export function isOBJByType (o: any, type: any) {
    return Object.prototype.toString.call(o) === '[object ' + (type || 'Object') + ']'
}

export function isOBJ (obj: any) {
    const type = typeof obj
    return type === 'object' && !!obj
}

export function isEmpty (obj: any) {
    if (obj === null) return true
    if (isOBJByType(obj, 'Number')) {
        return false
    }
    return !obj
}

export function equal (a: any, b: any) {
    return a.toString() === b.toString()
}

export function formatStackMsg (error: Error) {
    let stack = (error.stack || '')
        .replace(/\n/gi, '')
        .split(/\bat\b/)
        .slice(0, 9)
        .join('@')
        .replace(/\?[^:]+/gi, '')
    let msg = error.toString();
    if (msg.indexOf('[object ') === 0) {
        try {
            msg = JSON.stringify(error);
        } catch (err) {
            msg = '[Aegis detect value stringify error] ' + err.toString();
        }
    }
    if (stack.indexOf(msg) < 0) {
        stack = msg + '@' + stack
    }
    return stack;
}

interface stringObj {
    [propName: string]: any
}

export function buildParam (obj: stringObj) {
    const str = []
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            const v = obj[k];
            str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
    }
    return str.join('&')
}

export function isNative (Ctor: any) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export function canUseResourceTiming (): boolean {
    if (typeof performance !== 'undefined' && isNative(Performance)) {
        return true;
    }
    return false;
}

// 获取aid，aid支持跨域
// https://pub.idqqimg.com/ab6592966bbc4f5ab51193d3612f609a.html
// 该页面会将aid通过postmessage传过来
// TODO，该页面的测速数据是否需要屏蔽
export function getAid (): Promise<string> {
    let aid = window.localStorage.getItem('AEGIS_ID');
    if (!aid) {
        return new Promise((resolve, reject) => {
            window.addEventListener('message', function getAidFromIframe(event) {
                if (event.origin === 'https://pub.idqqimg.com') {
                    if (event.data) {
                        window.localStorage.setItem('AEGIS_ID', event.data);
                        resolve(event.data);
                    } else {
                        reject();
                    }
                }
            });
            const iframe: HTMLIFrameElement = document.createElement('iframe');
            iframe.src = 'https://pub.idqqimg.com/ab6592966bbc4f5ab51193d3612f609a.html';
            iframe.width = '0';
            iframe.height = '0';
            if (document.body) {
                document.body.append(iframe);
            } else {
                window.addEventListener('load', () => {
                    document.body.append(iframe);
                })
            }
        })
    }
    return Promise.resolve(aid);
}