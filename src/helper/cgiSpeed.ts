import overrideFetch from '../override/fetch';
import overrideXhr from '../override/XMLHttpRequest';

export default function (emit: Function) {
    overrideFetch(emit);
    overrideXhr(emit);
}