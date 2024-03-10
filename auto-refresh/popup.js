let intervalInput = document.getElementById('initialIntervalInput');
let startRefreshBtn = document.getElementById('startRefreshBtn');
let stopRefreshBtn = document.getElementById('stopRefreshBtn');

startRefreshBtn.addEventListener('click', async function () {
    const tab = await getCurrentTab();
    chrome.runtime.sendMessage({cmd: "startRefresh", tab: tab, interval: parseInt(intervalInput.value)}, function (res) {
        updatePopup();
    });
});

stopRefreshBtn.addEventListener('click', async function () {
    const tab = await getCurrentTab();
    chrome.runtime.sendMessage({cmd: "stopRefresh", tab: tab}, function (res) {
        updatePopup();
    });
});

async function updatePopup() {
    const tab = await getCurrentTab();
    chrome.runtime.sendMessage({cmd: "getOriginInterval", tab: tab}, function (res) {
        intervalInput.value = res;
    });

    chrome.runtime.sendMessage({cmd: "isRefreshing", tab: tab}, function (res) {
        if (res) {
            startRefreshBtn.disabled = true;
            intervalInput.disabled = true;
            stopRefreshBtn.disabled = false;
        } else {
            startRefreshBtn.disabled = false;
            intervalInput.disabled = false;
            stopRefreshBtn.disabled = true;
        }
    });
}

function getCurrentTab() {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                } else {
                    resolve(tabs[0]);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

updatePopup();
