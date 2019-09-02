import { canUseResourceTiming } from '../utils/index';
import { send } from '../helper/send';
import { AegisConfig } from '../interface/config';

/**
 * 发送performance数据
 */
export default (config: AegisConfig) => {
    if(!canUseResourceTiming) return;

    const t: PerformanceTiming = performance.timing;
    if (t.domComplete) {
        sendPerformance(config);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => {
                sendPerformance(config)
            }, 0);
        })
    }
}

const sendPerformance = (config: AegisConfig) => {
    const t: PerformanceTiming = performance.timing,
          dnsLookup: number = t.domainLookupEnd - t.domainLookupStart,
          tcp: number = t.connectEnd - t.connectStart,
          ssl: number = t.secureConnectionStart === 0 ? 0 : t.requestStart - t.secureConnectionStart,
          ttfb: number = t.responseStart - t.requestStart,
          contentDownload: number = t.responseEnd - t.responseStart,
          domParse: number = t.domInteractive - t.domLoading,
          resourceDownload: number = t.loadEventStart - t.domInteractive;
    send(`${config.performanceUrl}?id=${config.id}&dnsLookup=${dnsLookup}&tcp=${tcp}&ssl=${ssl}&ttfb=${ttfb}&contentDownload=${contentDownload}&domParse=${domParse}&resourceDownload=${resourceDownload}`);
}