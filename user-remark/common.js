const dbName = 'UserRemarkDatabase';
let githubReposUrl;
let githubToken;
let branchName = 'main';
chrome.storage.local.get(['githubReposUrl', 'githubToken', 'githubBranch'], function (result) {
    if (result.githubReposUrl) githubReposUrl = result.githubReposUrl;
    if (result.githubToken) githubToken = result.githubToken;
    if (result.githubBranch) branchName = result.githubBranch;
});

const moduleDiv = document.createElement('div');
moduleDiv.className = 'remark-menu';

const exportBtn = document.createElement('button');
exportBtn.innerText = '导出到本地';
exportBtn.title = '将浏览器中的数据导出到本地文件';

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.style.display = 'none';

const importBtn = document.createElement('button');
importBtn.innerText = '从本地导入';
importBtn.title = '将本地文件的数据导入到浏览器';

const exportGithubBtn = document.createElement('button');
exportGithubBtn.innerText = '上传到Github';
exportGithubBtn.title = '将浏览器中的数据导出并上传到Github仓库';

const importGithubBtn = document.createElement('button');
importGithubBtn.innerText = '从Github导入';
importGithubBtn.title = '将Github仓库的数据下载并导入到浏览器';

const deleteBtn = document.createElement('button');
deleteBtn.innerText = '删除全部备注';
deleteBtn.title = '将浏览器中的备注数据全部删除';

const contentDiv = document.createElement('div');
contentDiv.className = 'tips';

moduleDiv.appendChild(exportBtn);
moduleDiv.appendChild(fileInput);
moduleDiv.appendChild(importBtn);
moduleDiv.appendChild(exportGithubBtn);
moduleDiv.appendChild(importGithubBtn);
moduleDiv.appendChild(deleteBtn);
moduleDiv.appendChild(contentDiv);
document.body.appendChild(moduleDiv);
document.addEventListener('mousemove', function (event) {
    if (event.clientX <= 135 && event.clientY >= moduleDiv.offsetTop && event.clientY <= moduleDiv.offsetTop + moduleDiv.offsetHeight) {
        moduleDiv.style.left = '0';
    } else {
        moduleDiv.style.left = '-135px';
    }
});

function initEvent(dbManager, exportGithubFileName, exportLocalFileName) {
    exportBtn.addEventListener('click', function () {
        dbManager.openDatabase().then((db) => {
            dbManager.getDataByCursor(row => row.remark).then((result) => {
                exportToJsonFile(result, exportLocalFileName);
            });
        }).catch((error) => {
            console.error(error);
        });
    });

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const result = e.target.result;
                const data = JSON.parse(result);
                for (let i = 0; i < data.length; i++) {
                    dbManager.openDatabase().then((db) => {
                        dbManager.updateData({id: data[i].id, remark: data[i].remark});
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                contentDiv.innerHTML = `<b style="color:green">导入完成，请刷新页面</b>`;
            };
            reader.readAsText(file);
        }
        this.value = '';
    });

    importBtn.addEventListener('click', function () {
        fileInput.click();
    });

    exportGithubBtn.addEventListener('click', function () {
        if (!githubReposUrl) {
            contentDiv.innerHTML = `<b style="color:red">请设置Github仓库地址</b>`;
            return;
        }
        dbManager.openDatabase().then((db) => {
            dbManager.getDataByCursor(row => row.remark).then((result) => {
                const url = githubReposUrl + exportGithubFileName;
                checkFileExistence(url, githubToken, branchName).then(fileData => {
                    if (fileData) {
                        updateFile(url, githubToken, branchName, fileData.sha, JSON.stringify(result)).then(() => contentDiv.innerHTML = `<b style="color:green">上传到Github完成</b>`).catch(error => contentDiv.textContent = error);
                    } else {
                        createFile(url, githubToken, branchName, JSON.stringify(result)).then(() => contentDiv.innerHTML = `<b style="color:green">上传到Github完成</b>`).catch(error => contentDiv.textContent = error);
                    }
                }).catch(error => contentDiv.textContent = error);
            });
        }).catch((error) => {
            console.error(error);
        });
    });

    importGithubBtn.addEventListener('click', function () {
        if (!githubReposUrl) {
            contentDiv.innerHTML = `<b style="color:red">请设置Github仓库地址</b>`;
            return;
        }
        const url = githubReposUrl + exportGithubFileName;
        checkFileExistence(url, githubToken, branchName).then(fileData => {
            if (fileData) {
                const data = JSON.parse(decodeContent(fileData.content));
                for (let i = 0; i < data.length; i++) {
                    dbManager.openDatabase().then((db) => {
                        dbManager.updateData({id: data[i].id, remark: data[i].remark});
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                contentDiv.innerHTML = `<b style="color:green">导入完成，请刷新页面</b>`;
            } else {
                contentDiv.innerHTML = `<b style="color:red">Github仓库中没有找到该文件</b>`;
            }
        }).catch(error => contentDiv.textContent = error);
    });

    deleteBtn.addEventListener('click', function () {
        indexedDB.deleteDatabase(dbName);
        contentDiv.innerHTML = `<b style="color:green">删除完成，请刷新页面</b>`;
    });
}