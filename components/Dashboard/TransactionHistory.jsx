"use client";
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Plus, Trash2, X } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { formatCurrency } from '../../lib/utils';
import { getCategories, deleteCategory, saveCategory } from '../../lib/storage'; // Added imports
import Modal from '../UI/Modal';
import TransactionForm from '../Transactions/TransactionForm';
import styles from './TransactionHistory.module.scss';
import clsx from 'clsx';

const TransactionHistory = ({ transactions, onRefresh, year }) => {

  const scrollRef = useRef(null);
  // Need to listen to category changes locally or force refresh?
  // Since categories are in localStorage, simple state updates might not sync if we don't re-fetch.
  // We'll maintain local categories state and update it on add/delete.
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(getCategories());
  }, []); // Initial load

  const refreshCategories = () => {
    setCategories(getCategories());
  };
  
  // Interaction State
  const [detailView, setDetailView] = useState(null); 
  const [editingTx, setEditingTx] = useState(null); 
  const [isAddingTx, setIsAddingTx] = useState(false);
  
  // Category Management State
  const [isAddingCat, setIsAddingCat] = useState(null); // 'income' or 'expense'
  const [newCatName, setNewCatName] = useState('');

  const months = useMemo(() => {
    let generatedMonths = [];
    
    // Default to current year if no year is selected
    const targetYear = year ? Number(year) : new Date().getFullYear();

    // Generate Jan-Dec for the target year
    generatedMonths = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(targetYear, i, 1);
      return {
        id: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy'),
        dateObj: date,
        txs: [],
      };
    });

    transactions.forEach(tx => {
      const txDate = parseISO(tx.date);
      const monthGroup = generatedMonths.find(m => isWithinInterval(txDate, {
        start: startOfMonth(m.dateObj),
        end: endOfMonth(m.dateObj)
      }));
      if (monthGroup) monthGroup.txs.push(tx);
    });

    return generatedMonths;
  }, [transactions, year]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 620; // Wider cards now
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (month, category) => {
    const monthTxs = month.txs.filter(t => t.category === category.name);
    setDetailView({
      monthStr: month.id,
      monthLabel: month.label,
      categoryName: category.name,
      transactions: monthTxs,
      dateObj: month.dateObj
    });
  };

  const closeDetail = () => {
    setDetailView(null);
    setEditingTx(null);
    setIsAddingTx(false);
  };

  const handleTxSuccess = () => {
    onRefresh(); // Refresh global data
    closeDetail();
  };

  // Category Actions
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    saveCategory({ name: newCatName, type: isAddingCat });
    refreshCategories();
    setNewCatName('');
    setIsAddingCat(null);
  };

  const handleDeleteCategory = (id, e) => {
    e.stopPropagation(); // Prevent row click
    if (confirm('Delete this category?')) {
      deleteCategory(id);
      refreshCategories();
    }
  };

  // Sort and split categories
  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');



  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <button onClick={() => scroll('left')}><ChevronLeft size={20} /></button>
          <button onClick={() => scroll('right')}><ChevronRight size={20} /></button>
        </div>
      </div>
      
      <div className={styles.scrollArea} ref={scrollRef}>
        {months.map((month) => {
          const monthIncomeTotal = month.txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
          const monthExpenseTotal = month.txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
          
          return (
            <div key={month.id} className={styles.monthCard}>
              <div className={styles.cardHeader}>
                <h4>{month.label}</h4>
              </div>
              
              <div className={styles.columns}>
                {/* Income Column */}
                <div className={styles.column}>
                  <div className={styles.colHeader}>Income</div>
                  <div className={styles.list}>
                    {incomeCategories.map(cat => {
                      const catTxs = month.txs.filter(t => t.category === cat.name);
                      const total = catTxs.reduce((sum, t) => sum + Number(t.amount), 0);
                      const hasValue = catTxs.length > 0;
                      return (
                         <div key={cat.id} className={styles.rowWrapper}>
                          <button 
                            className={clsx(styles.row, styles.incomeRow)}
                            onClick={() => handleCategoryClick(month, cat)}
                          >
                            <span className={styles.catName}>{cat.name}</span>
                            <span className={clsx(styles.catVal, !hasValue && styles.empty)}>
                              {hasValue ? formatCurrency(total) : '-'}
                            </span>
                          </button>
                          <button className={styles.deleteBtn} onClick={(e) => handleDeleteCategory(cat.id, e)}>
                              <Trash2 size={12} />
                            </button>
                        </div>
                      );
                    })}
                     <button className={styles.inlineAddBtn} onClick={() => setIsAddingCat('income')}>
                       <Plus size={14} /> Add Income
                     </button>
                  </div>
                  <div className={styles.colTotal}>
                    <span>Total</span>
                    <span className={styles.incomeTotal}>{formatCurrency(monthIncomeTotal)}</span>
                  </div>
                </div>

                {/* Expense Column */}
                 <div className={styles.column}>
                  <div className={styles.colHeader}>Expenses</div>
                  <div className={styles.list}>
                    {expenseCategories.map(cat => {
                      const catTxs = month.txs.filter(t => t.category === cat.name);
                      const total = catTxs.reduce((sum, t) => sum + Number(t.amount), 0);
                      const hasValue = catTxs.length > 0;
                      
                      return (
                        <div key={cat.id} className={styles.rowWrapper}>
                          <button 
                            className={styles.row}
                            onClick={() => handleCategoryClick(month, cat)}
                          >
                            <span className={styles.catName}>{cat.name}</span>
                            <span className={clsx(styles.catVal, !hasValue && styles.empty)}>
                              {hasValue ? formatCurrency(total) : '-'}
                            </span>
                          </button>
                           <button className={styles.deleteBtn} onClick={(e) => handleDeleteCategory(cat.id, e)}>
                              <Trash2 size={12} />
                            </button>
                        </div>
                      );
                    })}
                    <button className={styles.inlineAddBtn} onClick={() => setIsAddingCat('expense')}>
                       <Plus size={14} /> Add Expense
                     </button>
                  </div>
                  <div className={styles.colTotal}>
                    <span>Total</span>
                    <span className={styles.expenseTotal}>{formatCurrency(monthExpenseTotal)}</span>
                    
                  </div>
                </div>
              </div>
              <div className={styles.balance}>
                <span>Month Balance</span>
                <div className={monthIncomeTotal - monthExpenseTotal > 0  ? styles.positive : styles.negative}>
                <span  >{formatCurrency(monthIncomeTotal - monthExpenseTotal)}</span>
             </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={!!isAddingCat} onClose={() => setIsAddingCat(null)} title={`New ${isAddingCat === 'income' ? 'Income' : 'Expense'} Category`}>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            value={newCatName} 
            onChange={e => setNewCatName(e.target.value)} 
            placeholder="Category Name"
            autoFocus
            required
            style={{ padding: '0.75rem', borderRadius: '8px', background: '#0d1117', border: '1px solid #30363d', color: 'white' }}
          />
          <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 600 }}>Save</button>
        </form>
      </Modal>

      {/* Detail Manager Modal (Reused) */}
      <Modal 
        isOpen={!!detailView} 
        onClose={closeDetail} 
        title={detailView ? `${detailView.categoryName} - ${detailView.monthLabel}` : ''}
      >
        {detailView && (
          <div className={styles.manager}>
            {isAddingTx || editingTx ? (
              <TransactionForm 
                onSuccess={handleTxSuccess} 
                onClose={() => { setIsAddingTx(false); setEditingTx(null); }}
                initialData={editingTx}
                defaultCategory={detailView.categoryName}
                defaultDate={format(detailView.dateObj, 'yyyy-MM-01')} 
              />
            ) : (
              <>
                <div className={styles.txList}>
                  {detailView.transactions.length === 0 ? (
                    <p className={styles.noTx}>No transactions for this category.</p>
                  ) : (
                    detailView.transactions.map(tx => (
                      <div key={tx.id} className={styles.managerItem} onClick={() => setEditingTx(tx)}>
                        <div className={styles.managerInfo}>
                          <span className={styles.date}>{format(parseISO(tx.date), 'MMM d')}</span>
                          <span className={styles.desc}>{tx.description || 'No description'}</span>
                        </div>
                        <div className={styles.managerRight}>
                          <span className={styles.amount}>{formatCurrency(tx.amount)}</span>
                          <Edit2 size={14} className={styles.editIcon} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button className={styles.addBtn} onClick={() => setIsAddingTx(true)}>
                  <Plus size={16} /> Add Entry
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionHistory;
