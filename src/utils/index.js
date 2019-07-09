"use strict";
exports.__esModule = true;
function extend() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 0) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
    }
    var to = Object(args[0]);
    for (var index = 1; index < args.length; index++) {
        var nextSource = args[index];
        if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}
exports.extend = extend;
function isOBJByType(o, type) {
    return Object.prototype.toString.call(o) === '[object ' + (type || 'Object') + ']';
}
exports.isOBJByType = isOBJByType;
function isOBJ(obj) {
    var type = typeof obj;
    return type === 'object' && !!obj;
}
exports.isOBJ = isOBJ;
function isEmpty(obj) {
    if (obj === null)
        return true;
    if (isOBJByType(obj, 'Number')) {
        return false;
    }
    return !obj;
}
exports.isEmpty = isEmpty;
function equal(a, b) {
    return a.toString() === b.toString();
}
exports.equal = equal;
function formatStackMsg(error) {
    var stack = (error.stack || '')
        .replace(/\n/gi, '')
        .split(/\bat\b/)
        .slice(0, 9)
        .join('@')
        .replace(/\?[^:]+/gi, '');
    var msg = error.toString();
    if (stack.indexOf(msg) < 0) {
        stack = msg + '@' + stack;
    }
    return stack;
}
exports.formatStackMsg = formatStackMsg;
function buildParam(obj) {
    var str = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            var v = obj[k];
            str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
    }
    return str.join('&');
}
exports.buildParam = buildParam;
