import { LOG_TYPE } from '../interface/log'; 
import { formatStackMsg, isOBJ } from '../utils';

export default function () {
    return function(data: any, success: Function, fail: Function) {
        const {
            msg,
            rowNum = 0,
            colNum = 0,
            target = location.href,
            error,
            level = LOG_TYPE.ERROR
        } = data;

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
        } else if(isOBJ(msg)) {
            let value = '';
            try {
                value = JSON.stringify(msg);
            } catch (err) {
                value = '[BJ_REPORT detect value stringify error] ' + err.toString()
            }

            success({
                msg: value,
                rowNum,
                colNum,
                target,
                level
            });
        } else {
            let _unformatMsg = msg;
            
            if(typeof _unformatMsg !== 'string') {
                _unformatMsg = _unformatMsg.toString();
            }

            success({
                msg: _unformatMsg,
                rowNum,
                colNum,
                target: location.href,
                level
            });
        }
    }
}