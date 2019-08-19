export interface SpeedLog {
    url?: string, // 请求地址,
    method?: string, //请求方法
    duration?: number, // 耗时
    isHttps?: boolean, // 请求地址是否https
    // ret?: number, // cgi 的状态码，如果是图片或其他的，默认为 0 
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