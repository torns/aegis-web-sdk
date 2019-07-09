export interface SpeedLog {
    url?: string, // 请求地址,
    method?: string, //请求方法
    openTime?: number,   // 请求开始时的时间戳,
    sendTime?: number,   // 请求发送时的时间戳
    responseTime?: number // 请求返回时的时间戳
    duration?: number, // 耗时
    ret?: number, // cgi 的状态码，如果是图片或其他的，默认为 0 
    status?: number, // http 返回码
}

export interface EventLog {
    event?: string, // 请求地址,
    startTime?: number,   // 请求开始时的时间戳,
    endTime?: number,   // 请求发送时的时间戳
    duration?: number // 耗时
}

export interface NormalLog {
    msg: string,
    target: string,
    rowNum: number,
    colNum: number,
    level: LOG_TYPE
}

export enum LOG_TYPE {
    DEBUG = 1,
    INFO = 2,
    ERROR = 4
}

export interface ErrorMsg {
    msg: string
    rowNum: string
    colNum: string
    target: string
    level: LOG_TYPE
}

export interface AegisConfig {
    id: number | string
    uin: number | string
    version: number
    url: string
    speedApi ?: string
    ext: object | null
    level: number
    ignore: any[]
    random: number
    delay: number
    maxLength: 500
    repeat: number
    isDebug: boolean
    isWhiteList: boolean
    monitorUrl: '//report.url.cn/report/report_vm' // 自定义统计上报地址
    offlineLog: boolean
    offlineLogExp: number // 离线日志过期时间，默认3天
    offlineLogAuto: boolean // 是否自动询问服务器需要自动上报
    submit ?: Function
    onReport ?:Function // 与上报同时触发，用于统计相关内容
    beforeReport ?: Function // aop：上报前执行，如果返回 false 则不上报
}