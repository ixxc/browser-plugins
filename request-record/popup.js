document.addEventListener('DOMContentLoaded', function () {
    const domainTextarea = document.getElementById('domainTextarea');
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.runtime.sendMessage({tabId: tabs[0].id}, function (res) {
            const domains = new Set();
            res.urls.forEach(url => domains.add(new URL(url).hostname));

            const urlsList = document.getElementById('urlsListTextarea');
            urlsList.value = res.urls.map(url => url + '\n').join('');

            const domainList = document.getElementById('domainTextarea');
            domainList.value += [...new Set(Array.from(domains).map(str => Array.from(str).reverse().join(""))
                .sort().map(str => Array.from(str).reverse().join("")))].map(domain => domain + '\n').join('');
        });
    });
});