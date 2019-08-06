import { SpeedLog } from '../interface/log'; 
import overrideImage from '../override/image';
import { formatUrl, urlIsHttps } from '../utils';

let observeDom: MutationObserver;

/**
 * 通过MutationObserver监听dom变化，从而获取img、scrirt、带background-image节点的变化。
 * @param emit 
 */
export default function (emit: Function) {
    overrideImage(emit);

    if (observeDom && observeDom instanceof MutationObserver) {
        observeDom.disconnect();
    }

    // 监听dom变化
    observeDom = new MutationObserver(function (mutations) {
        const changeDomList: Element[] = [];
        mutations.forEach(mutation => {
            switch(mutation.type) {
                // dom操作
                case 'childList':
                    const addedNodes = mutation.addedNodes;
                    const addedNodesLength = addedNodes.length || 0;
                    for (let i = 0; i < addedNodesLength; i++) {
                        if (addedNodes[i] instanceof Element) {
                            changeDomList.push(addedNodes[i] as Element);
                            domChangeHandler(addedNodes[i] as Element, emit);
                        }
                    }
                    break;

                // 属性变化
                case 'attributes':
                    const target = mutation.target;
                    // fix: document.createElement('img') 插入dom树之后会生成两条mutation，导致上报两次
                    if(!(target instanceof Element) || changeDomList.indexOf(target) !== -1) {
                        return;
                    }
                    
                    if(mutation.attributeName === 'src' && target instanceof HTMLImageElement) {
                        domChangeHandler(target, emit);
                    } else {
                        // TODD 需要判断修改前后是否有改动到background-images
                        const backgroundImage = getComputedStyle(target).backgroundImage;
                        if(!backgroundImage || backgroundImage === 'none') return;

                        attributeChangeHandler(mutation, backgroundImage);
                    }
                    break;
            }
        })
        changeDomList.length = 0;
    })

    observeDom.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        attributeFilter: ['src', 'style', 'class']
    })
}

/**
 * 当修改的dom节点是img或者script时添加onload事件，否则监听是否有background-image变动
 * @param e 新增的dom节点
 * @param emit 
 */
function domChangeHandler (e: Element, emit: Function) {
    // 之所以不能等于当前location.href，是因为在chrome中如果src没赋值，会默认取到location.href
    if((e instanceof HTMLImageElement || e instanceof HTMLScriptElement) && e.src && e.src !== location.href) {
        // img且有src属性
        const speedLog: SpeedLog = {
            url: formatUrl(e.src),
            status: 200,
            isHttps: urlIsHttps(e.src)
        }
        const sendTime = Date.now();
        e.addEventListener('load', () => {
            speedLog.duration = Date.now() - sendTime;
            emit(speedLog);
        });

        e.addEventListener('error', () => {
            speedLog.status = 400;
            speedLog.duration = Date.now() - sendTime;
            emit(speedLog);
        });

    } else {
        // TODO 这里可能会有点耗性能
        // 标签有background-image
        const backgroundImage = getComputedStyle(e).backgroundImage;
        if(!backgroundImage || backgroundImage === 'none') return;
        // 创建改写过的Image实例触发图片测速
        let url = backgroundImage.replace(/^url\("/, '').replace(/"\)$/,'');
        new Image().src = url;
    }
}

// 新建一个游离的div用来获取属性修改之前的background-image
const div = document.createElement('div');
/**
 * 判断节点修改前后是否有background-image变动
 * @param mutation 
 * @param newBackgroundImage 
 */
function attributeChangeHandler (mutation: MutationRecord, newBackgroundImage: string) {
    const attributeName = mutation.attributeName;
    div.setAttribute(attributeName, mutation.oldValue);
    const beforeBackgroundImage = window.getComputedStyle(div).backgroundImage;

    if(beforeBackgroundImage !== newBackgroundImage) {
        let url = newBackgroundImage.replace(/^url\("/, '').replace(/"\)$/,'');
        new Image().src = url;
    }

    div.setAttribute(attributeName, '');
}