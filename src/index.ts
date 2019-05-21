import overrideXhr from './override/overrideXhr';

export default class AegisCgiSpeed{
    private static instance: AegisCgiSpeed;

    constructor() {
        if(AegisCgiSpeed.instance) {
            return AegisCgiSpeed.instance;
        }
        this.overrideXhr();
    }

    overrideXhr = overrideXhr;

    onRequest: any;

}