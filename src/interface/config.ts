export interface AegisConfig {
    id: number | string
    uin: number | string
    aid ?: string
    version: number
    reportAssetSpeed ?: boolean // 是否开启静态资源测速
    reportApiSpeed ?: boolean // 是否开启接口测速
    url: string
    speedUrl: string
    performanceUrl ?: string 
    ext: object | null
    level: number
    ignore: any[]
    random: number
    delay: number
    maxLength: 500
    repeat: number
    isWhiteList: boolean
    monitorUrl: string // 自定义统计上报地址
    offlineLog: boolean
    offlineLogExp: number // 离线日志过期时间，默认3天
    offlineLogAuto: boolean // 是否自动询问服务器需要自动上报
    submit ?: Function
    onReport ?:Function // 与上报同时触发，用于统计相关内容
    beforeReport ?: Function // aop：上报前执行，如果返回 false 则不上报
    assetLogFullSize ?: number // 静态资源等待上报日志的最大量，当超过这个量会立即上报
    restfulApiList ?: any[] // 列出restful接口，将对这些接口归并上报
}