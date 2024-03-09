const reposInput = document.getElementById('reposInput');
reposInput.addEventListener('input', function () {
    chrome.storage.local.set({'githubReposUrl': reposInput.value.trim()});
});

const tokenInput = document.getElementById('tokenInput');
tokenInput.addEventListener('input', function () {
    chrome.storage.local.set({'githubToken': tokenInput.value.trim()});
});

const branchInput = document.getElementById('branchInput');
branchInput.addEventListener('input', function () {
    chrome.storage.local.set({'githubBranch': branchInput.value.trim()});
});

chrome.storage.local.get(['githubReposUrl', 'githubToken', 'githubBranch'], function (result) {
    if (result.githubReposUrl) reposInput.value = result.githubReposUrl;
    if (result.githubToken) tokenInput.value = result.githubToken;
    if (result.githubBranch) branchInput.value = result.githubBranch;
});