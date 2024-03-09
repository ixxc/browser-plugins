function checkFileExistence(url, accessToken, branchName) {
    return fetch(url + `?ref=${branchName}`, {
        method: 'GET',
        headers: {'Authorization': `token ${accessToken}`}
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 404) {
            return null;
        } else {
            throw new Error('Error checking file existence');
        }
    });
}

function createFile(url, accessToken, branchName, fileContent) {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: '‭',
            content: encodeContent(fileContent),
            branch: branchName
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to update file');
        }
        return response.json();
    });
}

function updateFile(url, accessToken, branchName, fileSha, newFileContent) {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: '‭',
            content: encodeContent(newFileContent),
            sha: fileSha,
            branch: branchName
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to update file');
        }
        return response.json();
    });
}

function encodeContent(content) {
    const encoder = new TextEncoder();
    const encodedArray = encoder.encode(content);
    const encodedString = String.fromCharCode.apply(null, encodedArray);
    return btoa(encodedString);
}

function decodeContent(content) {
    const decodedString = atob(content);
    const decodedArray = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; ++i) {
        decodedArray[i] = decodedString.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(decodedArray);
}

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function exportToJsonFile(data, filename) {
    const jsonStr = JSON.stringify(data);
    const blob = new Blob([jsonStr], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function getTimeSuffix() {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hour = ('0' + now.getHours()).slice(-2);
    const minute = ('0' + now.getMinutes()).slice(-2);
    const second = ('0' + now.getSeconds()).slice(-2);
    return year + month + day + hour + minute + second;
}

function debounce(func, delay) {
    let debounceTimer;
    return function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    };
}