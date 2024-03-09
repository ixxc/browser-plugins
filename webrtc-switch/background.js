chrome.runtime.onStartup.addListener(function () {
    chrome.privacy.network.webRTCIPHandlingPolicy.get({}).then(obj => {
        if (obj.value === 'disable_non_proxied_udp') {
            chrome.action.setIcon({path: "./icons/icon-inactive.png"});
        }
    });
});

chrome.action.onClicked.addListener(function (tab) {
    chrome.privacy.network.webRTCIPHandlingPolicy.get({}).then(obj => {
        if (obj.value === 'disable_non_proxied_udp') {
            chrome.privacy.network.webRTCIPHandlingPolicy.set({
                value: 'default'
            }, function () {
                chrome.action.setIcon({path: "./icons/icon.png"});
            });
        } else {
            chrome.privacy.network.webRTCIPHandlingPolicy.set({
                value: 'disable_non_proxied_udp'
            }, function () {
                chrome.action.setIcon({path: "./icons/icon-inactive.png"});
            });
        }
    });
});