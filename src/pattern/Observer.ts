export default class {
    private watchers: Function[] = [];

    constructor(handler: Function) {
        handler(this.notify.bind(this));
    }

    // 通知
    notify (data: any) {
        this.watchers.forEach((watcher) => {
            watcher(data);
        })
    }

    // 订阅消息
    observe (watcher: Function) {
        this.watchers.push(watcher);
    }

    //取消订阅
    disconnect (watcher: Function) {
        this.watchers = this.watchers.filter(item => item !== watcher);
    }
}