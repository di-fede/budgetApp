import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions',
  CATEGORIES: 'finance_categories',
  RECURRING: 'finance_recurring',
};

const DEFAULT_CATEGORIES = [
  { id: 'c1', name: 'Housing', type: 'expense', system: true }, // mortgage/taxes/fees
  { id: 'c2', name: 'Utilities', type: 'expense', system: true },
  { id: 'c3', name: 'Food', type: 'expense', system: true },
  { id: 'c4', name: 'Entertainment', type: 'expense', system: true },
  { id: 'c5', name: 'Healthcare', type: 'expense', system: true },
  { id: 'c6', name: 'Personal', type: 'expense', system: true },
  { id: 'c7', name: 'Car Payment', type: 'expense', system: true },
  { id: 'c8', name: 'Car Insurance', type: 'expense', system: true },
  { id: 'c9', name: 'Home Insurance', type: 'expense', system: true },
  { id: 'c10', name: 'Other', type: 'expense', system: true },
  { id: 'c11', name: 'Salary', type: 'income', system: true },
  { id: 'c12', name: 'Freelance', type: 'income', system: true },
];

// Helper to get from storage safely
const getFromStorage = (key, defaultVal) => {
  if (typeof window === 'undefined') return defaultVal;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

// Start: Exported Functions

export const getCategories = () => {
  return getFromStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
};

export const saveCategory = (category) => {
  const categories = getCategories();
  const newCat = { ...category, id: uuidv4(), system: false };
  const updated = [...categories, newCat];
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
  return newCat;
};

export const deleteCategory = (id) => {
  const categories = getCategories();
  const updated = categories.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
};

export const updateCategory = (id, newName) => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index].name = newName;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }
};

export const getTransactions = () => {
  const txs = getFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
  // Sort by date desc
  return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const addTransaction = (tx) => {
  const transactions = getTransactions();
  const newTx = { ...tx, id: uuidv4(), createdAt: new Date().toISOString() };
  const updated = [newTx, ...transactions];
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  return newTx;
};

export const deleteTransaction = (id) => {
  const transactions = getTransactions();
  const updated = transactions.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
};

export const updateTransaction = (updatedTx) => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === updatedTx.id);
  if (index !== -1) {
    transactions[index] = updatedTx;
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }
};

// Recurring Logic
export const getRecurring = () => {
  return getFromStorage(STORAGE_KEYS.RECURRING, []);
};

export const addRecurring = (template) => {
  const templates = getRecurring();
  const newTemplate = { ...template, id: uuidv4(), lastGenerated: new Date().toISOString() };
  const updated = [...templates, newTemplate];
  localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(updated));
  return newTemplate;
};

// Check and generate recurring
export const checkRecurringTransactions = () => {
  if (typeof window === 'undefined') return;
  const templates = getRecurring();
  let txsChanged = false;
  let templatesChanged = false;
  const currentTxs = getTransactions(); // We manipulate this copy then save once

  const updatedTemplates = templates.map(t => {
    let lastGen = new Date(t.lastGenerated);
    const now = new Date();
    let generated = false;

    // Check if a month has passed since last generation
    // Simple logic: if lastGen + 1 month <= now, generate.
    // Loop to catch up multiple months
    while (true) {
      const nextDue = new Date(lastGen);
      nextDue.setMonth(nextDue.getMonth() + 1);

      if (nextDue <= now) {
        // Generate Transaction
        const newTx = {
          id: uuidv4(),
          type: t.type,
          amount: t.amount,
          category: t.category,
          description: t.description + ' (Recurring)',
          date: nextDue.toISOString().split('T')[0], // The due date
          createdAt: new Date().toISOString()
        };
        currentTxs.push(newTx);
        lastGen = nextDue;
        generated = true;
        txsChanged = true;
      } else {
        break;
      }
    }

    if (generated) {
      templatesChanged = true;
      return { ...t, lastGenerated: lastGen.toISOString() };
    }
    return t;
  });

  if (txsChanged) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(currentTxs));
  }
  if (templatesChanged) {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(updatedTemplates));
  }
  
  return txsChanged;
};

// Seed functionality for demo
export const seedInitialData = () => {
  if (typeof window === 'undefined') return;
  if(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) return;

  const demoTxs = [
    { date: '2023-10-01', amount: 3500, type: 'income', category: 'Salary', description: 'Monthly Salary' },
    { date: '2023-10-05', amount: 1200, type: 'expense', category: 'Housing', description: 'Rent' },
    { date: '2023-10-07', amount: 150, type: 'expense', category: 'Food', description: 'Groceries' },
    { date: '2023-10-10', amount: 60, type: 'expense', category: 'Utilities', description: 'Electric Bill' },
  ].map(t => ({ ...t, id: uuidv4(), createdAt: new Date().toISOString() }));

  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(demoTxs));
};
