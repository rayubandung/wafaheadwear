import Dexie from 'dexie';

export const db = new Dexie('CashflowUMKM_DB');
db.version(1).stores({
  categories: '++id, name, icon',
  inventory: '++id, name, categoryId, stock, price',
  transactions: '++id, type, amount, date, description'
});