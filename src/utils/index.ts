
import { ErrorMsg } from '../interface/log';

export function extend (target: object, varArgs: object): object { // .length of function is 2
    if (target === null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
    }

    let to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

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

export function formatError (errObj: Error): ErrorMsg {
    try {
        if (errObj.stack) {
            const regResult = errObj.stack.match('https?://[^\n]+')
            let url = regResult ? regResult[0] : ''
            let rowResult = url.match(':(\\d+):(\\d+)')
            
            const rowCols = rowResult ? [...rowResult] : ['0', '0', '0'];

            const stack = formatStackMsg(errObj)
            return {
                msg: stack,
                rowNum: rowCols[1],
                colNum: rowCols[2],
                target: url.replace(rowCols[0] as string, ''),
                _orgMsg: errObj.toString()
            }
        } else {
            return {
                msg: JSON.stringify(errObj),
                rowNum: '0',
                colNum: '0',
                target: '',
                _orgMsg: errObj.toString()
            }
        }
    } catch (err) {
        return {
            msg: JSON.stringify(errObj),
            rowNum: '0',
            colNum: '0',
            target: '',
            _orgMsg: ''
        }
    }
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
    return stack
}

export function buildParam (obj: object) {
    const str = []
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            const v = obj[k] as string;
            str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
    }
    return str.join('&')
}