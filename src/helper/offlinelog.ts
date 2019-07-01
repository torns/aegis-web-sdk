import { extend, equal } from '../utils/index';
import { ErrorMsg, AegisConfig } from '../interface/log';

let offlineBuffer: ErrorMsg[] = [];

interface counter {
    [propName: string]: number
}

interface getLogConfig {
    uin: number | string
    id: number | string
    start: number
    end: number
}
/**
 * 封装对 IndexDB 的读写操作
 */
export default class OfflineDB {
    db ?: IDBDatabase;
    offlineLog ?: boolean;
    constructor () {
        this.db = null;
    }

    getStore = ()  => {
        const transaction = this.db.transaction('logs', 'readwrite');
        return transaction.objectStore('logs');
    }

    ready = (callback: Function) => {
        if (!window.indexedDB) {
            return callback('no support');
        }

        if (this.db) {
            setTimeout(() => {
                callback(null);
            }, 0)
            return
        }
        const version = 1
        const request = window.indexedDB.open('badjs', version);

        if (!request) {
            return callback('no request');
        }

        request.onerror = (e) => {
            callback(e);
            this.offlineLog = false;
        }

        request.onsuccess = (e) => {
            this.db = request.result;
            setTimeout(function () {
                callback(null)
            }, 500)
        }

        request.onupgradeneeded = (e) => {
            const db = request.result;
            if (!db.objectStoreNames.contains('logs')) {
                db.createObjectStore('logs', { autoIncrement: true })
            }
        }
    }

    insertToDB = (log: any) => {
        const store = this.getStore()
        store.add(log)
    }

    addLogs = (logs: any) => {
        if (!this.db) {
            return
        }

        for (let i = 0; i < logs.length; i++) {
            this.insertToDB(logs[i])
        }
    }

    /**
     * 过滤出日期和id还有uid相符合的日志信息
     * @param opt
     * @param callback
     */
    getLogs (opt: getLogConfig, callback: Function) {
        if (!this.db) {
            return
        }
        const store = this.getStore();
        const request = store.openCursor();
        const result: any[] | { f: number; l: any; m: number; t: any; v: any; }[] = [];
        const msgObj: counter = {};
        const msgList: any[] | any[] = [];
        const urlObj: counter = {};
        const urlList: any[] | any[] = [];
        let num = 0;
        let num1 = 0;
        request.onsuccess = function (event) {
            const cursor: IDBCursor = event.target.result;
            if (cursor && cursor.value) {
                if (cursor.value.time >= opt.start && cursor.value.time <= opt.end &&
                    equal(cursor.value.id, opt.id) && equal(cursor.value.uin, opt.uin)) {
                    const {
                        from,
                        level,
                        msg,
                        time,
                        version
                    } = cursor.value

                    if (typeof msgObj[msg] !== 'number') {
                        msgList.push(msg);
                        msgObj[msg] = num++;
                    }

                    if (typeof urlObj[from] !== 'number') {
                        urlList.push(from);
                        urlObj[from] = num1++;
                    }

                    result.push({
                        f: urlObj[from],
                        l: level,
                        m: msgObj[msg],
                        t: time,
                        v: version
                    })
                }
                cursor.continue();
            } else {
                callback(null, result, msgList, urlList)
            }
        }

        request.onerror = function (e) {
            callback(e)
        }
    }

    clearDB = (daysToMaintain: number) => {
        if (!this.db) {
            return;
        }

        const store = this.getStore();
        if (!daysToMaintain) {
            store.clear();
            return;
        }
        const range = (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000);
        const request = store.openCursor();
        request.onsuccess = function (event) {
            const cursor = request.result;
            if (cursor && (cursor.value.time < range || !cursor.value.time)) {
                store.delete(cursor.primaryKey);
                cursor.continue();
            }
        }
    }

    save2Offline = (key: any, _msgObj: ErrorMsg, config: AegisConfig) => {
        const msgObj = extend({
            id: config.id,
            uin: config.uin,
            time: Date.now() - 0,
            version: config.version 
        }, _msgObj) as ErrorMsg;

        if (this.db) {
            this.insertToDB(msgObj);
            return
        }

        if (!this.db && !offlineBuffer.length) {
            this.ready((err: any) => {
                if (err) {
                    console.error(err);
                    return;
                }

                if (offlineBuffer.length) {
                    this.addLogs(offlineBuffer);
                    offlineBuffer = [];
                }
            });
        }
        offlineBuffer.push(msgObj);
    }
}
