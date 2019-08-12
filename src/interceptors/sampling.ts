import { ErrorMsg } from '../interface/log';

// 抽样丢弃
export default function(threshold = 0) {
    return function(msg: ErrorMsg, success: Function, fail: Function) {
        if(Math.random() < threshold) {
            success(msg);
        } else {
            fail(msg);
        }
    }
}