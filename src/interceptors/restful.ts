import { SpeedLog } from '../interface/log';

/**
 * 判断speedlog是否是restful中的一条，是的话将其归并上报
 */
export default (restfulApiList: any[] = []) => {
    return function (msg: SpeedLog, success: Function, fail: Function) {
        restfulApiList.forEach((restfulApi) => {
            if(msg.url && msg.url.indexOf(restfulApi) !== -1) {
                msg.url = restfulApi;
            }
        })
        success(msg);
    }
}