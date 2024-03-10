let requestsByTab = {};
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const {tabId, url} = details;
        if (!requestsByTab[tabId]) {
            requestsByTab[tabId] = [];
        }
        requestsByTab[tabId].push(url);
    },
    {urls: ["<all_urls>"]}
);

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    const urls = requestsByTab[req.tabId] || [];
    sendResponse({urls: urls});
    return true;
});

chrome.tabs.onRemoved.addListener(function (tabId) {
    if (requestsByTab[tabId]) {
        delete requestsByTab[tabId];
    }
});

setInterval(() => {
    chrome.action.setBadgeText({});
}, 10000);