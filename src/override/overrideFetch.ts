import AegisCgiSpeed from '../index';
import Resource from './Resource';

const originFetch = (<any>window).fetch;
export default function overrideFetch(this: AegisCgiSpeed) {
    const acs = this;

    (<any>window).fetch = function() {
        const args = Array.prototype.slice.call(arguments);
        
        const resource: Resource = new Resource({
            from: location.href,
            url: args[0],
            method: args[1] ? args[1].method || 'get' : 'get'
        });
        resource.send();

        const fetchPromise = originFetch(...args);
        fetchPromise.then(function(res: any){
            resource.onreadystatechange(4, acs);
            return res
        })

        return fetchPromise;
    }
}