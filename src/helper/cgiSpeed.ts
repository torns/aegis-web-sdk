import overrideFetch from '../override/fetch';
import overrideXhr from '../override/XMLHttpRequest';
// import { canUseResourceTiming } from '../utils';
// import resourceTiming from './resourceTiming';

export default function (emit: Function) {
    // if (canUseResourceTiming()) {
    //     resourceTiming.getCgiLog(emit);
    //     return;
    // }
    overrideFetch(emit);
    overrideXhr(emit);
}