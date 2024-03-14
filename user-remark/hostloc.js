headline.innerText = 'Hostloc数据备份';
const dbManager = new IndexedDBManager(dbName, 1, 'hostloc');
initEvent(dbManager, 'HostlocRemark.json', 'HostlocRemark_' + getTimeSuffix() + '.json');

function _displayRemark() {
    const allUser = document.querySelectorAll('div[id^=favatar]');
    for (let i = 0; i < allUser.length; i++) {
        const currentUser = allUser[i].querySelectorAll('a[href^=space-uid-][class=xw1]')[0];
        if (!currentUser) continue;
        const currentUserId = currentUser.href.substring(currentUser.href.lastIndexOf('/') + 1, currentUser.href.lastIndexOf('.'));

        let remark;
        if (allUser[i].querySelectorAll('textarea').length == 0) {
            remark = document.createElement('textarea');
            remark.style.width = '154px';
            remark.style.border = '1px dashed #CDCDCD';
            remark.className = currentUserId;
            allUser[i].appendChild(remark);
        } else {
            remark = allUser[i].querySelectorAll('textarea')[0];
        }

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
}

_displayRemark();

const hiddenposts = document.getElementById('hiddenposts');
if (hiddenposts) {
    const remarkObserver = new MutationObserver(function (mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                _displayRemark();
            }
        }
    });
    remarkObserver.observe(hiddenposts, {childList: true});
}