const dbPromise = idb.open('post-store', 1, (db) => {
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', {keyPath: 'id'});
    }
    if (!db.objectStoreNames.contains('sync-posts')) {
      db.createObjectStore('sync-posts', {keyPath: 'id'});
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

  readAllData = (st) => {
    return dbPromise 
      .then((db) => {
        let tx = db.transaction(st, 'readonly');
        let store = tx.objectStore(st);
        return store.getAll();
      })
  }

  clearAllData = (st) => {
    return dbPromise 
      .then((db) => {
        let tx = db.transaction(st, 'readwrite');
        let store = tx.objectStore(st);
        store.clear();
        return tx.complete;
      })
  }

  deleteItemFromData = (st, id) => {
    return dbPromise
      .then((db) => {
        let tx = db.transaction(st, 'readwrite');
        let store = tx.objectStore(st);
        store.delete(id);
        return tx.complete;
      })
      .then(() => {
        console.log('Item delete!');
      })
  }