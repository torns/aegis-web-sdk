"use strict";
exports.__esModule = true;
var index_1 = require("../utils/index");
function send(url, data) {
    if (navigator.sendBeacon && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon(url, data);
    }
    else {
        new Image().src = url;
    }
}
exports.send = send;
function formatParams(data) {
    if (typeof data.join === 'undefined') {
        data = [data];
    }
    var params = [];
    var count = 0;
    data.forEach(function (error, index) {
        if (index_1.isOBJ(error)) {
            for (var key in error) {
                var value = error[key];
                if (!index_1.isEmpty(value)) {
                    if (index_1.isOBJ(value)) {
                        try {
                            value = JSON.stringify(value);
                        }
                        catch (err) {
                            value = '[BJ_REPORT detect value stringify error] ' + err.toString();
                        }
                    }
                    params.push(key + '[' + count + ']=' + encodeURIComponent(value));
                }
            }
            count++;
        }
    });
    return params.join('&') + ("&count=" + count);
}
exports.formatParams = formatParams;
function sendOffline(url, data) {
    var iframe = document.createElement('iframe');
    iframe.name = 'badjs_offline_' + (Date.now() - 0);
    iframe.frameBorder = '0';
    iframe.height = '0';
    iframe.width = '0';
    iframe.src = 'javascript:false';
    iframe.onload = function () {
        var form = document.createElement('form');
        form.style.display = 'none';
        form.target = iframe.name;
        form.method = 'POST';
        form.action = url + '/offlineLog';
        var input = document.createElement('input');
        input.style.display = 'none';
        input.type = 'hidden';
        input.name = 'offline_log';
        input.value = data;
        if (iframe.contentDocument) {
            iframe.contentDocument.body.appendChild(form);
        }
        form.appendChild(input);
        form.submit();
        console.log('report offline log success');
        setTimeout(function () {
            document.body.removeChild(iframe);
        }, 5000);
        iframe.onload = null;
    };
    document.body.appendChild(iframe);
}
exports.sendOffline = sendOffline;
