headline.innerText = 'V2EX数据备份';
headline.style.color = 'var(--box-foreground-color)';
const dbManager = new IndexedDBManager(dbName, 1, 'v2ex');
initEvent(dbManager, 'V2exRemark.json', 'V2exRemark_' + getTimeSuffix() + '.json');

if (window.location.href.includes('v2ex.com/t/')) {
    const allUser = document.getElementsByClassName('avatar');
    for (let i = 0; i < allUser.length; i++) {
        if (allUser[i].parentElement.parentElement.tagName === 'TD') continue;
        const currentUserId = 'uid-' + allUser[i].alt;
        const remark = document.createElement('textarea');
        remark.style.width = '99%';
        remark.style.height = '18px';
        remark.style.border = '1px dashed #e2e2e2';
        remark.style.resize = 'none';
        remark.style.color = 'var(--box-foreground-color)';
        remark.style.backgroundColor = 'var(--box-background-color)';
        remark.className = currentUserId;
        remark.addEventListener('input', debounce(function () {
            dbManager.openDatabase().then((db) => {
                dbManager.updateData({id: currentUserId, remark: remark.value});
                const allThisUserRemark = document.getElementsByClassName(currentUserId);
                for (let j = 0; j < allThisUserRemark.length; j++) {
                    allThisUserRemark[j].value = remark.value;
                    adjustTextareaHeight(allThisUserRemark[j]);
                }
            }).catch((error) => {
                console.error(error);
            });
            adjustTextareaHeight(this);
        }, 400));

        if (allUser[i].parentElement.parentElement.tagName === 'DIV') {
            allUser[i].parentElement.parentElement.parentElement.appendChild(remark);
        } else {
            const agoElement = allUser[i].parentElement.parentElement.getElementsByClassName('ago')[0];
            if (agoElement) agoElement.parentNode.insertBefore(remark, agoElement.nextSibling);
        }

        dbManager.openDatabase().then((db) => {
            dbManager.getData(currentUserId).then((result) => {
                if (result && result.remark) {
                    remark.value = result.remark;
                    adjustTextareaHeight(remark);
                }
            });
        }).catch((error) => {
            console.error(error);
        });
    }
}