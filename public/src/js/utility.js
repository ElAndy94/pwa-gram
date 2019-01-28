const dbPromise = idb.open('post-store', 1, (db) => {
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', {keyPath: 'id'});
    }
  });

  writeData = (st, data) => {
    return dbPromise
      .then((db) => {
        let tx = db.transaction(st, 'readwrite');
        let store = tx.objectStore(st);
        store.put(data);
        return tx.complete;
      });
  }