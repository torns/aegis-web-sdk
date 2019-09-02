import { LOG_TYPE } from '../interface/log'; 
import { formatStackMsg, isOBJ } from '../utils';

export default function () {
    return function(data: any, success: Function, fail: Function) {
        !data && fail();

        let {
            msg,
            rowNum = 0,
            colNum = 0,
            target = location.href,
            error,
            level = LOG_TYPE.ERROR
        } = data;

        // window.onerror上报的
        if(error && error.stack) {
            const regResult = error.stack.match('https?://[^\n]+');
            let url = regResult ? regResult[0] : ''
            let rowResult = url.match(':(\\d+):(\\d+)')
            
            const rowCols = rowResult ? [...rowResult] : ['0', '0', '0'];

            const stack = formatStackMsg(error);
            success({
                msg: stack,
                rowNum: rowCols[1] || rowNum,
                colNum: rowCols[2] || rowCols,
                target: url.replace(rowCols[0] as string, '') || target,
                level
            });
        }
        // 用户主动上报
        else if (msg) {
            let _msg;
            // 优先使用toString
            if(typeof msg.toString === 'function') {
                _msg = msg.toString();
                if (_msg.indexOf('[object ') === 0) {
                    _msg = '';
                }
            }
            // 没有toString或者toString返回的没意义，则使用JSON.stringify
            if (!_msg) {
                try {
                    _msg = JSON.stringify(msg);
                } catch (err) {
                    _msg = '[Aegis detect value stringify error] ' + err.toString();
                }
            }

            success({
                msg: _msg,
                rowNum,
                colNum,
                target: location.href,
                level
            });
        }
        // 用户上报了false | 0 | null之类的数据
        else {
            success({
                msg: msg,
                rowNum,
                colNum,
                target: location.href,
                level
            });
        }
    }
}