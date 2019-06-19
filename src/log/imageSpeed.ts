import Observer from '../pattern/Observer';
import { SpeedLog } from '../interface/log'; 
import overrideImage from '../override/image';

export default new Observer(function (notify: Function) {
    // 改写Image构造函数
    overrideImage(notify);

    // 监听dom变化
    const observeDom = new MutationObserver(function (mutations) {
        mutations.forEach(mutation => {
            switch(mutation.type) {
                // dom操作
                case 'childList': 
                    mutation.addedNodes.length && mutation.addedNodes.forEach(e => {
                        if(e instanceof Element) {
                            // 元素节点
                            domChangeHandler(e, notify);
                        }
                    })
                    break;

                // 属性变化
                case 'attributes': 


                    notify(mutation);
                    break;
            }
        })
    })

    observeDom.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['src', 'style', 'class']
    })
})

function domChangeHandler (e: Element, notify: Function) {
    if(e instanceof HTMLImageElement && e.src) {
        // img且有src属性
        const speedLog: SpeedLog = {
            url: e.src,
            method: 'get',
            openTime: Date.now(),
            sendTime: Date.now(),
            ret: 0,
            status: 200
        }
        e.addEventListener('load', () => {
            speedLog.responseTime = Date.now();
            speedLog.duration = speedLog.responseTime - speedLog.sendTime;
            notify(speedLog);
        })
    } else {
        // 标签有background-image
        const backgroundImage = getComputedStyle(e).backgroundImage;
        if(!backgroundImage && backgroundImage === 'none') return;
        
        // 创建改写过的Image实例触发图片测速
        let url = backgroundImage.replace(/^url\("/, '').replace(/"\)$/,'');
        new Image().src = url;
    }
}