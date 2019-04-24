
## wardjs-report-speed

    测速上报，包含图片资源、数据接口上报
    
    index.html 为示例网页

## Getting started

- browser

```javascript
const WardjsReport = window['wardjs-report'].default
const wardjs = new WardjsReport({
    id: 0, // 上报 id
    uin: 0, // user id
    url: '//now.qq.com/badjs', // 上报接口
    version: 0,
    ext: null, // 扩展参数 用于自定义上报
    level: 4, // 错误级别 1-debug 2-info 4-error
    ignore: [], // 忽略某个错误, 支持 Regexp 和 Function
    random: 1, // 抽样 (0-1] 1-全量
    delay: 1000, // 延迟上报
    maxLength: 500, // 每条日志内容最大长度，通常不建议修改
    submit: null, // 自定义上报方式
    monitorUrl: '//report.url.cn/report/report_vm', // 自定义统计上报地址
    repeat: 5, // 重复上报次数(对于同一个错误超过多少次不上报),
    offlineLog: true,
    offlineLogExp: 3, // 离线日志过期时间，默认3天
    offlineLogAuto: true, // 是否自动询问服务器需要自动上报
    onReport: () => {
    }, // 与上报同时触发，用于统计相关内容
    beforeReport: () => {
        return true
    } // aop：上报前执行，如果返回 false 则不上报
})
```

### 参数说明

上报 id 需要去 badjs 服务申请

| 参数名 | 默认值 | 简介 |
| --- | --- | --- | 
| id | 0 | 上报id |
| uin | 0 |  user id |
| version | 0 | 上报版本号 |
| url | '//now.qq.com/badjs' | 上报接口 |
| ext | null |  扩展参数 用于自定义上报 |
| level | 4 |  错误级别 1-debug 2-info 4-error |
| ignore | [] | 忽略某个错误, 支持 Regexp 和 Function |
| random | 1 |  抽样 (0-1] 1-全量 |
| delay | 1000 |  延迟上报时间 |
| maxLength | 500 | 每条日志默认长度（不建议修改） |
| submit | null |  自定义上报方式 |
| repeat | 5 |  重复上报次数(对于同一个错误超过多少次不上报) |
| offlineLog | true | 是否开启离线日志 |
| offlineLogExp | 3 |  离线日志过期时间，默认3天 |
| offlineLogAuto | true | 是否自动询问服务器需要自动上报 |
| onReport | function (bid, reportLog) {} | 与上报同时触发，用于统计相关内容 |
| beforeReport | function (reportLog) {} | AOP：上报前执行，如果返回 false 则此条信息不上报 |



### 用法

引入即可，会在window.onload中上报资源速度，重写了fetch方法，会在每次请求后上报请求时间。

## License

MIT
