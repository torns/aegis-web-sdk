export function isOBJByType (o, type) {
    return Object.prototype.toString.call(o) === '[object ' + (type || 'Object') + ']'
}

export function isOBJ (obj) {
    const type = typeof obj
    return type === 'object' && !!obj
}

export function isEmpty (obj) {
    if (obj === null) return true
    if (isOBJByType(obj, 'Number')) {
        return false
    }
    return !obj
}

export function extend (src, source) {
    for (const key in source) {
        src[key] = source[key]
    }
    return src
}

export function equal (a, b) {
    return a.toString() === b.toString()
}

export function processError (errObj) {
    try {
        if (errObj.stack) {
            let url = errObj.stack.match('https?://[^\n]+')
            url = url ? url[0] : ''
            let rowCols = url.match(':(\\d+):(\\d+)')
            if (!rowCols) {
                rowCols = [0, 0, 0]
            }

            const stack = processStackMsg(errObj)
            return {
                msg: stack,
                rowNum: rowCols[1],
                colNum: rowCols[2],
                target: url.replace(rowCols[0], ''),
                _orgMsg: errObj.toString()
            }
        } else {
            // ie 独有 error 对象信息，try-catch 捕获到错误信息传过来，造成没有msg
            if (errObj.name && errObj.message && errObj.description) {
                return {
                    msg: JSON.stringify(errObj)
                }
            }
            return errObj
        }
    } catch (err) {
        return errObj
    }
}

export function processStackMsg (error) {
    let stack = error.stack
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

const logMap = {}

export function isRepeat (error, repeat) {
    if (!isOBJ(error)) return true
    const msg = error.msg
    const times = logMap[msg] = (parseInt(logMap[msg], 10) || 0) + 1
    return times > repeat
}

export function buildParam (obj) {
    const str = []
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            str.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
        }
    }
    return str.join('&')
}

export function loadPako () {
    // if (window && window.pako) {
        return Promise.resolve()
    // }
    // return new Promise((resolve, reject) => {
        // if (document) {
        //     const script = document.createElement('script')
        //     script.src = 'https://pub.idqqimg.com/29ee73ea8c294fce8498cb50503521d4.js'
        //     script.crossOrigin = 'anonymous'
        //     script.onload = resolve
        //     script.onerror = reject
        //     document.getElementsByTagName('head')[0].appendChild(script)
        // }

    // })
}
