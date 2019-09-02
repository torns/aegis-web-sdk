# Aegis-H5-SDK
Aegis 前端监控平台上报sdk for h5

## 介绍
Aegis 是一站式前端监控平台，涵盖了错误监控，资源测速（img, script, css），接口测速，页面性能（首屏时间）。
无需侵入代码，只需引入 SDK 即可自动完成所有监控上报。

## 使用方法

### 申请项目
1. 前往 Aegis 管理后台 [https://aegis.ivweb.io](https://aegis.ivweb.io) ， 未注册用户需先通过注册验证

2. 申请项目，申请完成后得到项目 id， id 在使用 sdk 时候会使用。

### 使用SDK 

#### 安装 SDK
在项目内安装 aegis-h5-sdk 
`npm install aegis-h5-sdk`

#### 引入 SDK
针对各种情况， SDK 提供了三种引入方式，选择适合业务中的一种即可。无论哪种使用方法，请务必保证 sdk 在 `<head></head>` 内，最先申明。这样能保证拿到各类数据监控
1. cdn引入  
官方暂无 cdn 资源提供， 请业务方发布 `node_modules/aegis-h5-sdk/lib/Aegis.min.js`


2. 内联引入  
若构建工具支持在在 html 中引用 npm包 的情况，可参考
```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>腾讯直播-直播间</title>
    <script src="aegis-h5-sdk?__inline"></script>
    ...
</head>
<body>
...
</body>
</html>
```

3. 手动引入  
（构建工具不支持在 html 中引入 npm包 的情况）
 将 node_modules/aegis-h5-sdk/lib/Aegis.min.js 拷贝至头部

#### SDK 实例化
引入 SDk 后，需实例化 SDK

```
var aegis = new Aegis({
    id: 1 // 在 aegis.ivwe.io 申请到的 id
});
```
更多 api 请点击这里

#### 查询数据
接入完成后，即可在 Aegis.ivweb.io 上查看项目数据

#### 项目调试
npm start
127.0.0.1:3001