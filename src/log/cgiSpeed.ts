import Observer from '../pattern/Observer';
import { SpeedLog } from '../interface/log';
import overrideFetch from '../override/fetch';
import overrideXhr from '../override/XMLHttpRequest';

export default new Observer(function (notify: Function) {
    overrideFetch(notify);
    overrideXhr(notify);
})