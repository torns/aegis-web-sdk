import { extend, equal } from '../utils/index'

let offlineBuffer = []

/**
 * 封装对 IndexDB 的读写操作
 */
export default class OfflineDB {
    constructor () {
        this.db = null
    }

    getStore () {
        const transaction = this.db.transaction('logs', 'readwrite')
        return transaction.objectStore('logs')
    }

    ready (callback) {
        const self = this
        if (!window.indexedDB) {
            return callback()
        }

        if (this.db) {
            setTimeout(function () {
                callback(null, self)
            }, 0)
            return
        }
        const version = 1
        const request = window.indexedDB.open('badjs', version)

        if (!request) {
            return callback()
        }

        request.onerror = function (e) {
            callback(e)
            this.offlineLog = false
            return true
        }

        request.onsuccess = function (e) {
            self.db = e.target.result
            setTimeout(function () {
                callback(null, self)
            }, 500)
        }

        request.onupgradeneeded = function (e) {
            const db = e.target.result
            if (!db.objectStoreNames.contains('logs')) {
                db.createObjectStore('logs', { autoIncrement: true })
            }
        }
    }

    insertToDB (log) {
        const store = this.getStore()
        store.add(log)
    }

    addLogs (logs) {
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
    getLogs (opt, callback) {
        if (!this.db) {
            return
        }
        const store = this.getStore()
        const request = store.openCursor()
        const result = []
        const msgObj = {}
        const msgList = []
        const urlObj = {}
        const urlList = []
        let num = 0
        let num1 = 0
        request.onsuccess = function (event) {
            const cursor = event.target.result
            if (cursor && cursor.value) {
                if (cursor.value.time >= opt.start && cursor.value.time <= opt.end &&
                    equal(cursor.value.id, opt.id) && equal(cursor.value.uin, opt.uin)) {
                    const { from, level, msg, time, version } = cursor.value
                    if (typeof msgObj[msg] !== 'number') {
                        msgList.push(msg)
                        msgObj[msg] = num++
                    }
                    if (typeof urlObj[from] !== 'number') {
                        urlList.push(from)
                        urlObj[from] = num1++
                    }
                    result.push({ f: urlObj[from], l: level, m: msgObj[msg], t: time, v: version })
                }
                cursor.continue()
            } else {
                callback(null, result, msgList, urlList)
            }
        }

        request.onerror = function (e) {
            callback(e)
            return true
        }
    }

    clearDB (daysToMaintain) {
        if (!this.db) {
            return
        }

        const store = this.getStore()
        if (!daysToMaintain) {
            store.clear()
            return
        }
        const range = (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000)
        const request = store.openCursor()
        request.onsuccess = function (event) {
            const cursor = event.target.result
            if (cursor && (cursor.value.time < range || !cursor.value.time)) {
                store.delete(cursor.primaryKey)
                cursor.continue()
            }
        }
    }

    save2Offline (key, msgObj, config) {
        msgObj = extend({ id: config.id, uin: config.uin, time: new Date() - 0, version: config.version }, msgObj)
        if (this.db) {
            this.insertToDB(msgObj)
            return
        }

        if (!this.db && !offlineBuffer.length) {
            this.ready(function (err, DB) {
                if (err) {
                    console.error(err)
                }
                if (DB) {
                    if (offlineBuffer.length) {
                        DB.addLogs(offlineBuffer)
                        offlineBuffer = []
                    }
                }
            })
        }
        offlineBuffer.push(msgObj)
    }
}
