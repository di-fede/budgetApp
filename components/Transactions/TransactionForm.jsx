import {
  getCategories,
  addTransaction,
  addRecurring,
  updateTransaction,
  saveCategory,
} from '../../lib/storage';
import styles from './TransactionForm.module.scss';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const TransactionForm = ({
  onSuccess,
  onClose,
  initialData = null,
  defaultDate = null,
  defaultCategory = '',
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const [formData, setFormData] = useState({
    id: initialData?.id || null,
    type: initialData?.type || 'expense',
    amount: initialData?.amount || '',
    category: initialData?.category || defaultCategory || '', // Initial empty, will update when categories load
    date: initialData?.date || defaultDate || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    recurring: false,
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  useEffect(() => {
    if (!initialData && defaultCategory && categories.length > 0) {
      const cat = categories.find((c) => c.name === defaultCategory);
      if (cat) {
        setFormData((prev) => ({ ...prev, type: cat.type }));
      }
    } else if (!formData.category && categories.length > 0) {
      // Set default category if not set
      setFormData((prev) => ({ ...prev, category: categories[0]?.name || '' }));
    }
  }, [defaultCategory, categories, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanAmount = Number(formData.amount);

    let finalCategory = formData.category;

    if (isCustomCategory) {
      if (!customCategoryName.trim()) return;
      finalCategory = customCategoryName.trim();

      // Save the new category
      saveCategory({
        name: finalCategory,
        type: formData.type,
      });
    }

    if (formData.id) {
      updateTransaction({
        ...formData,
        category: finalCategory,
        amount: cleanAmount,
      });
    } else {
      addTransaction({
        ...formData,
        category: finalCategory,
        amount: cleanAmount,
      });

      if (formData.recurring) {
        addRecurring({
          type: formData.type,
          amount: cleanAmount,
          category: finalCategory,
          description: formData.description,
        });
      }
    }

    onSuccess();
    onClose();
  };

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  // Update category when type changes
  const handleTypeChange = (type) => {
    const firstCat = categories.find((c) => c.type === type);
    setFormData({
      ...formData,
      type,
      category: firstCat ? firstCat.name : '',
    });
    setIsCustomCategory(false);
    setCustomCategoryName('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.typeSelector}>
        <button
          type="button"
          className={clsx(styles.typeBtn, formData.type === 'income' && styles.activeIncome)}
          onClick={() => handleTypeChange('income')}
        >
          Income
        </button>
        <button
          type="button"
          className={clsx(styles.typeBtn, formData.type === 'expense' && styles.activeExpense)}
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </button>
      </div>

      <div className={styles.group}>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
        />
      </div>

      <div className={styles.group}>
        <label>Category</label>
        {!isCustomCategory ? (
          <select
            value={formData.category}
            onChange={(e) => {
              if (e.target.value === 'NEW_CATEGORY_OPTION') {
                setIsCustomCategory(true);
                setFormData({ ...formData, category: '' });
              } else {
                setFormData({ ...formData, category: e.target.value });
              }
            }}
            required={!isCustomCategory}
          >
            <option value="">Select Category</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="NEW_CATEGORY_OPTION" style={{ fontWeight: '600' }}>
              + Create New Category
            </option>
          </select>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={customCategoryName}
              onChange={(e) => setCustomCategoryName(e.target.value)}
              placeholder="Enter new category name"
              required={isCustomCategory}
              autoFocus
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setIsCustomCategory(false)}
              className={styles.cancel}
              style={{ padding: '0.75rem', flex: '0 0 auto' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className={styles.group}>
        <label>Date</label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <div className={styles.group}>
        <label>Note / Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g. Monthly Rent"
        />
      </div>

      <div className={styles.group} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <input
          type="checkbox"
          id="recurring"
          style={{ width: 'auto', marginRight: '0.5rem' }}
          checked={formData.recurring}
          onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
        />
        <label
          htmlFor="recurring"
          style={{ marginBottom: 0, cursor: 'pointer', color: 'var(--text-color)' }}
        >
          Repeat Monthly
        </label>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onClose} className={styles.cancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submit}>
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
