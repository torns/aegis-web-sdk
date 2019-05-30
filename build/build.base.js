module.exports = {
    publicUrl: './', // 静态资源的 url ，默认为 '/'
    cache: false, // 启用或禁用缓存，默认为 true
    contentHash: false, // 禁止文件名hash
    scopeHoist: false, // 打开实验性的scope hoisting/tree shaking用来缩小生产环境的包。
    target: 'browser', // 浏览器/node/electron, 默认为 browser
    bundleNodeModules: false, // 当package.json的'target'设置'node' or 'electron'时，相应的依赖不会加入bundle中。设置true将被包含。
    logLevel: 3,
    /**
     * 5 = 储存每个信息
     * 4 = 输出信息、警告和错误附加时间戳和dev服务的http请求
     * 3 = 输出信息、警告和错误
     * 2 = 输出警告和错误
     * 1 = 输出错误
    */
    hmrPort: 0, // hmr socket 运行的端口，默认为随机空闲端口(在 Node.js 中，0 会被解析为随机空闲端口)
    hmrHostname: '', // 热模块重载的主机名，默认为 ''
    detailedReport: false // 打印 bundles、资源、文件大小和使用时间的详细报告，默认为 false，只有在禁用监听状态时才打印报告
}