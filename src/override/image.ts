import { SpeedLog } from '../interface/log';
import { formatUrl, urlIsHttps } from '../utils';

let alreadyOverride: boolean = false;

export default function overrideImage (notify: Function) {
    if(alreadyOverride) return;
    alreadyOverride = true;

    const realImage = (<any>window).Image;

    (<any>window).Image = function (width: any, height: any) {
        const img = new realImage(width, height);
        const speedLog: SpeedLog = {
            status: 200
        }
        const sendTime = Date.now();
        img.addEventListener('load', (event: Event) => {
            const url = (event.target as HTMLImageElement).src;
            speedLog.isHttps = urlIsHttps(url);
            speedLog.url = formatUrl(url);
            speedLog.duration = Date.now() - sendTime;
            notify && notify(speedLog);
        })
        img.addEventListener('error', (event: Event) => {
            const url = (event.target as HTMLImageElement).src;
            speedLog.isHttps = urlIsHttps(url);
            speedLog.url = formatUrl(url);
            speedLog.duration = Date.now() - sendTime;
            speedLog.status = 400;
            notify && notify(speedLog);
        })

        return img;
    }
}