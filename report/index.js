
function beaconPollyfill (url, data, type) {
    if (url.indexOf('http://') !== 0 || url.indexOf('https://') !== 0) {
        url = 'http:' + url
    }
    if (type === 'post') {
        fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json',
                Referer: `https://now.qq.com/`
            }
        }).catch((err) => {
            console.error(err)
        })
    } else {
        fetch(url, {
            headers: {
                Referer: `https://now.qq.com/`
            }
        }).catch((err) => {
            console.error(err)
        })
    }
}

export default function send (url, data, type) {
    beaconPollyfill(url, data, type)
}
