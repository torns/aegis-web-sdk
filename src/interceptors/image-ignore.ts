import { SpeedLog } from '../interface/log';
import { isOBJByType } from '../utils/index';

// 特定域名的丢弃
const ignoreList = ['report.url.cn', 'aegis.qq.com'];

export default function() {
    return function(msg: SpeedLog, success: Function, fail: Function) {
        let isIgnore = false;
        for (let i = 0, l = ignoreList.length; i < l; i++) {
            if(msg.url.indexOf(ignoreList[i]) > -1) {
                isIgnore = true;
            }
        }
        if(!isIgnore) {
            success(msg)
        } else {
            fail(msg);
        }
    }
}