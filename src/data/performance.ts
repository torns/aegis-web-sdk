export default class Data {
    //单例
    private static instance: Data;
    //回调
    private static callbacks: [];

    public resources: PerformanceEntry[];

    public whitelist: string[];

    constructor (config: {whitelist: string[]}) {
        if(Data.instance) return Data.instance;

        this.whitelist = config.whitelist;

        if(window.performance && window.performance.getEntriesByType !== undefined) {
            this.resources = window.performance.getEntriesByType("resource");
        }else if(window.performance && window.performance.webkitGetEntriesByType !== undefined) {
            this.resources = window.performance.webkitGetEntriesByType("resource");
        }else{
            //TODO performance不支持，改写XHR
            return;
        }
        
        if(window.PerformanceObserver) {
            const observer = new window.PerformanceObserver((list) => {
                const filteredList = list.getEntries().filter((resource) => {
                    return !this.whitelist.includes(resource.name);
                })
                if(!filteredList.length) return;
                Data.callbacks.forEach((cb) => {
                    cb(filteredList);
                })
            });
            observer.observe({entryTypes: ["resource"]});
        }
        
        Data.instance = this;
        Data.callbacks = [];
    }

    onNewData (cb) {
        Data.callbacks.push(cb);
    }
}