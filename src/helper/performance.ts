import { canUseResourceTiming } from '../utils/index';
import { send } from '../helper/send';
import { AegisConfig } from '../interface/config';

/**ß
 * 发送performance数据
 */
export default () => {
    if(!canUseResourceTiming) return;

    const t: PerformanceTiming = performance.timing;
    if (t.domComplete) {
        sendPerformance();
    } else {
        window.addEventListener('load', () => {
            setTimeout(sendPerformance, 0);
        })
    }
}

const sendPerformance = () => {
    const t: PerformanceTiming = performance.timing,
          loadPage: number = t.loadEventEnd - t.navigationStart,
          domReady: number = t.domComplete - t.responseEnd,
          lookupDomain: number = t.domainLookupEnd - t.domainLookupStart,
          request: number = t.responseEnd - t.requestStart,
          config: AegisConfig = this._config;
    send(`${this._config.performanceUrl}?id=${config.id}&uin=${config.uin}&version=${config.version}&loadPage=${loadPage}&domReady=${domReady}&lookupDomain=${lookupDomain}&request=${request}`);
}