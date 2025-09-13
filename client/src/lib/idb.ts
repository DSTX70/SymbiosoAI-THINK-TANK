export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('symbiosoai', 1);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('drafts')) {
        db.createObjectStore('drafts', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDraft(id: string, data: any): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(['drafts'], 'readwrite');
  const store = transaction.objectStore('drafts');
  await store.put({ id, data, timestamp: Date.now() });
}

export async function getDraft(id: string): Promise<any> {
  const db = await openDB();
  const transaction = db.transaction(['drafts'], 'readonly');
  const store = transaction.objectStore('drafts');
  
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result?.data);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(['drafts'], 'readwrite');
  const store = transaction.objectStore('drafts');
  await store.delete(id);
}

export async function getAllDrafts(): Promise<any[]> {
  const db = await openDB();
  const transaction = db.transaction(['drafts'], 'readonly');
  const store = transaction.objectStore('drafts');
  const request = store.getAll();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}