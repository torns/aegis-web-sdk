import { ErrorMsg, LOG_TYPE } from '../interface/log';

export default function(maxLength: number) {
    return function(msg: ErrorMsg, success: Function, fail: Function) {
        // 有效保证字符不要过长
        msg.msg = (msg.msg + '' || '').substr(0, maxLength);
        success(msg);
    }
}