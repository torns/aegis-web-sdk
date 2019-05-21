import overrideXhr from './override/overrideXhr';

export default class AegisCgiSpeed{
    constructor() {
        this.a = 1;
        this.overrideXhr();
    }
    
    a: number;

    overrideXhr = overrideXhr;

    onRequest() {
        //TODO
    }

}
new AegisCgiSpeed();