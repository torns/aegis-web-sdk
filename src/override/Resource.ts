import AegisCgiSpeed from '../index';
export default class Resource {
    constructor(params: {from: string, url: string, method: string}){
        this.from = params.from;
        this.url = params.url;
        this.method = params.method;
    }

    from: string;//当前地址
    url: string;//请求地址
    method: string;//请求方法
    //时间戳
    duration: number = 0;
    openTime: number = 0;
    sendTime: number = 0;
    responseTime: number = 0;


    open(){
        this.openTime = new Date().getTime();
    }

    send(){
        this.sendTime = new Date().getTime();
    }

    onreadystatechange(xhr, acs: AegisCgiSpeed){
        if(xhr.readyState === 4) {
            this.responseTime = new Date().getTime();
            this.duration = this.responseTime - this.sendTime;
        }
    }
}