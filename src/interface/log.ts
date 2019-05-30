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

}