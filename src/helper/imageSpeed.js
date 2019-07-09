"use strict";
exports.__esModule = true;
var image_1 = require("../override/image");
var observeDom;
function default_1(emit) {
    // 改写Image构造函数
    image_1["default"](emit);
    if (observeDom && observeDom instanceof MutationObserver) {
        observeDom.disconnect();
    }
    // 监听dom变化
    observeDom = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            switch (mutation.type) {
                // dom操作
                case 'childList':
                    mutation.addedNodes.length && mutation.addedNodes.forEach(function (e) {
                        if (e instanceof Element) {
                            // 元素节点
                            domChangeHandler(e, emit);
                        }
                    });
                    break;
                // 属性变化
                case 'attributes':
                    if (!(mutation.target instanceof Element))
                        return;
                    if (mutation.attributeName === 'src' && mutation.target instanceof HTMLImageElement) {
                        domChangeHandler(mutation.target, emit);
                    }
                    else {
                        // TODD 需要判断修改前后是否有改动到background-images
                        var backgroundImage = getComputedStyle(mutation.target).backgroundImage;
                        if (!backgroundImage || backgroundImage === 'none')
                            return;
                        attributeChangeHandler(mutation, backgroundImage);
                    }
                    break;
            }
        });
    });
    observeDom.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        attributeFilter: ['src', 'style', 'class']
    });
}
exports["default"] = default_1;
function domChangeHandler(e, emit) {
    // 之所以不能等于当前location.href，是因为在chrome中如果src没赋值，会默认取到location.href
    if (e instanceof HTMLImageElement && e.src && e.src !== location.href) {
        // img且有src属性
        var speedLog_1 = {
            url: e.src,
            method: 'get',
            openTime: Date.now(),
            sendTime: Date.now(),
            ret: 0,
            status: 200
        };
        e.addEventListener('load', function () {
            speedLog_1.responseTime = Date.now();
            speedLog_1.duration = speedLog_1.responseTime - speedLog_1.sendTime;
            emit(speedLog_1);
        });
    }
    else {
        // TODO 这里可能会有点耗性能
        // 标签有background-image
        var backgroundImage = getComputedStyle(e).backgroundImage;
        if (!backgroundImage || backgroundImage === 'none')
            return;
        // 创建改写过的Image实例触发图片测速
        var url = backgroundImage.replace(/^url\("/, '').replace(/"\)$/, '');
        new Image().src = url;
    }
}
// 新建一个游离的div用来获取属性修改之前的background-image
var div = document.createElement('div');
function attributeChangeHandler(mutation, newBackgroundImage) {
    var attributeName = mutation.attributeName;
    div.setAttribute(attributeName, mutation.oldValue);
    var beforeBackgroundImage = window.getComputedStyle(div).backgroundImage;
    if (beforeBackgroundImage !== newBackgroundImage) {
        var url = newBackgroundImage.replace(/^url\("/, '').replace(/"\)$/, '');
        new Image().src = url;
    }
    div.setAttribute(attributeName, '');
}
