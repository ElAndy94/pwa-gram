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

  urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  dataURItoBlob = (dataURI) => {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }