import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_STORE = {
  users: [],
  trips: [],
  itineraryDays: [],
  expenses: [],
  destinations: [],
  savedPlaces: [],
  checklists: [],
  packingLists: [],
  notifications: [],
  groupTrips: [],
};

export class DataStore {
  static getStore() {
    try {
      if (!fs.existsSync(STORE_PATH)) {
        fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
        return { ...DEFAULT_STORE };
      }
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.warn('[DataStore] Failed to read store.json, creating initial store:', e.message);
      return { ...DEFAULT_STORE };
    }
  }

  static saveStore(store) {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('[DataStore] Failed to persist data:', e.message);
      return false;
    }
  }

  static getCollection(collectionName) {
    const store = this.getStore();
    return store[collectionName] || [];
  }

  static setCollection(collectionName, items) {
    const store = this.getStore();
    store[collectionName] = items;
    this.saveStore(store);
    return items;
  }

  static find(collectionName, filter = {}) {
    const items = this.getCollection(collectionName);
    return items.filter((item) => {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && item[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  static findOne(collectionName, filter = {}) {
    const items = this.getCollection(collectionName);
    return (
      items.find((item) => {
        for (const [key, value] of Object.entries(filter)) {
          if (value !== undefined && item[key] !== value) {
            return false;
          }
        }
        return true;
      }) || null
    );
  }

  static findById(collectionName, id) {
    const items = this.getCollection(collectionName);
    return items.find((item) => item.id === id || item._id === id) || null;
  }

  static insert(collectionName, doc) {
    const store = this.getStore();
    if (!store[collectionName]) store[collectionName] = [];

    const id = doc.id || doc._id || `${collectionName.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newDoc = {
      _id: id,
      id,
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store[collectionName].push(newDoc);
    this.saveStore(store);
    return newDoc;
  }

  static findByIdAndUpdate(collectionName, id, updates) {
    const store = this.getStore();
    if (!store[collectionName]) return null;

    const index = store[collectionName].findIndex((item) => item.id === id || item._id === id);
    if (index === -1) return null;

    const existing = store[collectionName][index];
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    store[collectionName][index] = updated;
    this.saveStore(store);
    return updated;
  }

  static findByIdAndDelete(collectionName, id) {
    const store = this.getStore();
    if (!store[collectionName]) return false;

    const initialLength = store[collectionName].length;
    store[collectionName] = store[collectionName].filter((item) => item.id !== id && item._id !== id);
    this.saveStore(store);
    return store[collectionName].length < initialLength;
  }

  static deleteMany(collectionName, filter = {}) {
    const store = this.getStore();
    if (!store[collectionName]) return 0;

    const initialLength = store[collectionName].length;
    store[collectionName] = store[collectionName].filter((item) => {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && item[key] === value) {
          return false;
        }
      }
      return true;
    });
    this.saveStore(store);
    return initialLength - store[collectionName].length;
  }
}

export default DataStore;
