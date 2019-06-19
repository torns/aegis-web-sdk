import { ErrorMsg, LOG_TYPE } from '../interface/log';
import { isOBJ } from '../utils';

interface logMap {
    [propName: string]: any;
}

const logMap: logMap = {};

export function isRepeat (error: ErrorMsg, repeat: number) {
    if (!isOBJ(error)) return true
    const msg = error.msg || '';
    const times = logMap[msg] = (parseInt(logMap[msg], 10) || 0) + 1
    return times > repeat
}

// 防止错误重复上报
export default function(maxRepeat: number) {
    return function(msg: ErrorMsg, success: Function, fail: Function) {
        if(msg.level === LOG_TYPE.ERROR && isRepeat(msg, maxRepeat)) {
            fail(msg);
        } else {
            success(msg);
        }
    }
}
