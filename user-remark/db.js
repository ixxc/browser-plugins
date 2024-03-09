class IndexedDBManager {
    constructor(databaseName, version, storeName) {
        this.db = null;
        this.databaseName = databaseName;
        this.version = version;
        this.storeName = storeName;
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
            } else {
                const request = indexedDB.open(this.databaseName, this.version);

                request.onerror = (event) => {
                    reject(`Failed to open database: ${event.target.error}`);
                };

                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    resolve(this.db);
                };

                request.onupgradeneeded = (event) => {
                    this.db = event.target.result;
                    if (!this.db.objectStoreNames.contains(this.storeName)) {
                        const store = this.db.createObjectStore(this.storeName, {keyPath: 'id', autoIncrement: true});
                        // You can add additional configurations for the store here
                    }
                };
            }
        });
    }

    closeDatabase() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }

    addData(data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.add(data);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(`Failed to add data: ${event.target.error}`);
            };
        });
    }

    getData(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.get(key);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(`Failed to get data: ${event.target.error}`);
            };
        });
    }

    getDataByCursor(condition) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.openCursor();
            const result = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (condition(cursor.value)) {
                        result.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(result);
                }
            };

            request.onerror = (event) => {
                reject(`Failed to get data: ${event.target.error}`);
            };
        });
    }

    updateData(newData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.put(newData);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(`Failed to update data: ${event.target.error}`);
            };
        });
    }

    deleteData(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(key);

            request.onsuccess = (event) => {
                resolve(true);
            };

            request.onerror = (event) => {
                reject(`Failed to delete data: ${event.target.error}`);
            };
        });
    }
}