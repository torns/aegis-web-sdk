import { canUseResourceTiming } from '../utils/index';
import { send } from '../helper/send';
import { AegisConfig } from '../interface/config';

/**
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
          dnsLookup: number = t.domainLookupEnd - t.domainLookupStart,
          tcp: number = t.connectEnd - t.connectStart,
          ssl: number = t.secureConnectionStart === 0 ? 0 : t.requestStart - t.secureConnectionStart,
          ttfb: number = t.responseStart - t.requestStart,
          contentDownload: number = t.responseEnd - t.responseStart,
          domParse: number = t.domInteractive - t.domLoading,
          resourceDownload: number = t.loadEventStart - t.domInteractive;
    // TODO 发送数据
        //   config: AegisConfig = this._config;
    // send(`${this._config.performanceUrl}?id=${config.id}&uin=${config.uin}&version=${config.version}&loadPage=${loadPage}&domReady=${domReady}&lookupDomain=${lookupDomain}&request=${request}`);
}