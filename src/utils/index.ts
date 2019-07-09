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
    const msg = error.toString()
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