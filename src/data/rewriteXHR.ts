import Resource from '../interface/Resource';

const callbacks: any[] = [];

export default function onData(cb) {
    callbacks.push(cb);
}

rewriteXHR(window);
function rewriteXHR(window) {
    const RealXhr = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
        let resource: Resource = {
                name: '',
                duration: 0
            },
            startTime: number;

        const xhr: object = new RealXhr();
        //代理所有实例属性到真正的xhr
        for(const key in xhr) {
            Object.defineProperty(this, key, {
                get() {
                    switch(key) {
                        case 'open': 
                            return function () {
                                resource.name = arguments[1];
                                return xhr[key].apply(xhr, arguments);
                            };
                        case 'send':
                            return function () {
                                startTime = new Date().getTime();
                                return xhr[key].apply(xhr, arguments);
                            }
                    }
                    return xhr[key];
                },
                set(val: any) {
                    if(key === 'onreadystatechange') {
                        return xhr[key] = function() {
                            if(arguments[0].target.readyState === 4) {
                                setTimeout(() => {
                                    resource.duration = new Date().getTime() - startTime;
                                    callbacks.forEach((cb) => {
                                        cb && cb(resource);
                                    })
                                }, 0)
                            }
                            return val.apply(xhr, arguments)
                        }
                    }
                    return xhr[key] = val;
                },
                enumerable: true
            })
        }

    }
    window.XMLHttpRequest.prototype = RealXhr.prototype;
}