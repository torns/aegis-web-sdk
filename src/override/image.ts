import { SpeedLog } from '../interface/log';
import { formatUrl } from '../utils';

let alreadyOverride: boolean = false;

export default function overrideImage (notify: Function) {
    if(alreadyOverride) return;
    alreadyOverride = true;

    const realImage = (<any>window).Image;

    (<any>window).Image = function (width: any, height: any) {
        const img = new realImage(width, height);
        const speedLog: SpeedLog = {
            method: 'get',
            openTime: Date.now(),
            sendTime: Date.now(),
            ret: 0,
            status: 200
        }
        img.addEventListener('load', () => {
            speedLog.url = formatUrl(img.src);
            speedLog.responseTime = Date.now();
            speedLog.duration = speedLog.responseTime - speedLog.sendTime;
            notify && notify(speedLog);
        })

        return img;
    }
}