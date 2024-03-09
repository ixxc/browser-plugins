const dbManager = new IndexedDBManager(dbName, 1, 'nodeseek');
initEvent(dbManager, 'NodeSeekRemark.json', 'NodeSeekRemark_' + getTimeSuffix() + '.json');

const allUser = document.getElementsByClassName('nsk-content-meta-info');
for (let i = 0; i < allUser.length; i++) {
    const currentUser = allUser[i].getElementsByClassName('author-name')[0];
    const currentUserId = 'uid-' + currentUser.href.substring(currentUser.href.lastIndexOf('/') + 1);
    const remark = document.createElement('textarea');
    remark.style.marginLeft = '15px';
    remark.style.width = '300px';
    remark.style.border = '1px dashed #e2e2e2';
    remark.style.resize = 'none';
    remark.style.color = 'var(--text-color)';
    remark.style.backgroundColor = 'var(--bg-main-color)';
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
    allUser[i].appendChild(remark);

    dbManager.openDatabase().then((db) => {
        dbManager.getData(currentUserId).then((result) => {
            if (result) {
                remark.value = result.remark;
                adjustTextareaHeight(remark);
            }
        });
    }).catch((error) => {
        console.error(error);
    });
}