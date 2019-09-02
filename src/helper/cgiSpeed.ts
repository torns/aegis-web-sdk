import overrideFetch from '../override/fetch';
import overrideXhr from '../override/XMLHttpRequest';

export default function (emitCgi: Function, emitAsset: Function) {
    overrideFetch(emitCgi, emitAsset);
    overrideXhr(emitCgi, emitAsset);
}