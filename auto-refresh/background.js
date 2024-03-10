let tabIntervalXXXObject = {};
let handleXXXInterval;

function startXXXRefresh(tabIntervalObj, tabId, interval) {
    if (tabIntervalObj.hasOwnProperty(tabId)) {
        clearInterval(tabIntervalObj[tabId].handle);
        delete tabIntervalObj[tabId];
    }
    handleXXXInterval = setInterval(async function () {
        const tab = await getTabByXXXId(tabId);
        if (!tab) {
            clearInterval(tabIntervalObj[tabId].handle);
            delete tabIntervalObj[tabId];
        } else {
            if (tabIntervalObj[tabId].current > 0) {
                let value = tabIntervalObj[tabId].current--;
                chrome.action.setBadgeText({tabId: tabId, text: String(value)}, tabIntervalXXXCallback);
                if (!tabIntervalObj[tabId].updateIcon) {
                    chrome.action.setIcon({tabId: tabId, path: "./icons/icon-active.png"}, tabIntervalXXXCallback);
                    tabIntervalObj[tabId].updateIcon = true;
                }
            } else {
                tabIntervalObj[tabId].current = tabIntervalObj[tabId].interval;
                tabIntervalObj[tabId].updateIcon = false;
                chrome.tabs.reload(tabId, tabIntervalXXXCallback);
            }
        }
    }, 1000);
    tabIntervalObj[tabId] = {"interval": interval, "current": interval, "handle": handleXXXInterval, "updateIcon": false};
}

function stopXXXRefresh(tabIntervalObj, tabId) {
    if (tabIntervalObj.hasOwnProperty(tabId)) {
        chrome.action.setBadgeText({tabId: tabId, text: ""}, tabIntervalXXXCallback);
        chrome.action.setIcon({tabId: tabId, path: "./icons/icon-inactive.png"}, tabIntervalXXXCallback);
        clearInterval(tabIntervalObj[tabId].handle);
        delete tabIntervalObj[tabId];
    }
}

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    const tabId = req.tab.id;
    if (req.cmd == "startRefresh") {
        startXXXRefresh(tabIntervalXXXObject, tabId, req.interval);
    }

    if (req.cmd == "stopRefresh") {
        stopXXXRefresh(tabIntervalXXXObject, tabId);
    }

    if (req.cmd == "getOriginInterval") {
        if (tabIntervalXXXObject[tabId] == undefined || tabIntervalXXXObject[tabId] == null) {
            sendResponse(0);
        } else {
            sendResponse(tabIntervalXXXObject[tabId]["interval"]);
        }
    }

    if (req.cmd == "isRefreshing") {
        if (tabIntervalXXXObject[tabId] == undefined) {
            sendResponse(false);
        } else {
            sendResponse(true);
        }
    }

    sendResponse({});
});

function getTabByXXXId(tabId) {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.get(tabId, function (tab) {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    clearInterval(handleXXXInterval);
                } else {
                    resolve(tab);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function tabIntervalXXXCallback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    }
}
