const dbManager = new IndexedDBManager(dbName, 1, 'linuxdo');
initEvent(dbManager, 'LinuxDoRemark.json', 'LinuxDoRemark_' + getTimeSuffix() + '.json');