import { SpeedLog } from '../interface/log';

let alreadyOverride: boolean = false;

export default function overrideImage (notify: Function) {
    if(alreadyOverride) return;
    alreadyOverride = true;

    const realImage = (<any>window).Image;

    (<any>window).Image = function (...args: any) {
        const img = new realImage(...args);
        const speedLog: SpeedLog = {
            method: 'get',
            openTime: Date.now(),
            sendTime: Date.now(),
            ret: 0,
            status: 200
        }
        img.addEventListener('load', () => {
            speedLog.url = img.src;
            speedLog.responseTime = Date.now();
            speedLog.duration = speedLog.responseTime - speedLog.sendTime;
            notify && notify(speedLog);
        })

        return img;
    }
}