const dbManager = new IndexedDBManager(dbName, 1, 'v2ex');
initEvent(dbManager, 'V2exRemark.json', 'V2exRemark_' + getTimeSuffix() + '.json');