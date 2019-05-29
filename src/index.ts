import overrideXhr from './override/overrideXhr';
import overrideFetch from './override/overrideFetch';
import Resource from './override/Resource';

export default class AegisCgiSpeed{
    private static instance: AegisCgiSpeed;

    constructor() {
        if(AegisCgiSpeed.instance) {
            return AegisCgiSpeed.instance;
        }
        this.overrideXhr();
        this.overrideFetch();
    }

    overrideXhr = overrideXhr;

    overrideFetch = overrideFetch;

    onRequest: any;

}

(new AegisCgiSpeed()).onRequest = function(resource: Resource) {
    console.log(resource);
}