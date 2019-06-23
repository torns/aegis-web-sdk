import { ErrorMsg } from '../interface/log';
import { isOBJByType } from '../utils/index';

// 抽样丢弃
export default function(ignore: RegExp[] | Function | RegExp | Function[]) {

    const _ignore: (RegExp[] | Function[]) = isOBJByType(ignore, 'Array') ? (ignore as (RegExp[] | Function[])) : [ignore as RegExp | Function];

    return function(msg: ErrorMsg, success: Function, fail: Function) {
        let isIgnore = false;
        for (let i = 0, l = _ignore.length; i < l; i++) {
            const rule = _ignore[i];
            if (isOBJByType(rule, 'RegExp')) {
                if((rule as RegExp).test(msg.msg)) {
                    success(msg);
                } else {
                    fail(msg);
                }
            } else if(isOBJByType(rule, 'Function')) {
                if((rule as Function)(msg, msg.msg)) {
                    success(msg);
                } else {
                    fail(msg);
                }
            }
        }
    }
}