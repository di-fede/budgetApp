"use client";
import React, { useEffect, useState } from 'react';
import { getTransactions, seedInitialData, checkRecurringTransactions } from '../lib/storage';
import SummaryCards from '../components/Dashboard/SummaryCards';
import IncomeExpenseChart from '../components/Dashboard/IncomeExpenseChart';
import TransactionHistory from '../components/Dashboard/TransactionHistory'; // New component
import Modal from '../components/UI/Modal';
import TransactionForm from '../components/Transactions/TransactionForm';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalBalance: 0, totalIncome: 0, totalExpenses: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = () => {
    const txs = getTransactions();
    setTransactions(txs);

    const income = txs.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const expenses = txs.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    setSummary({
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
    });
  };

  useEffect(() => {
    seedInitialData();
    checkRecurringTransactions(); // Run check logic
    fetchData(); // Load data (including any new recurring ones)
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="dashboard">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: '#8b949e' }}>Welcome back, here is your financial overview.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '8px', 
            fontWeight: 600 
          }}
        >
          + Add New
        </button>
      </header>

      <SummaryCards summary={summary} />

      <div style={{ marginBottom: '1.5rem' }}>
        <IncomeExpenseChart transactions={transactions} />
      </div>

      <TransactionHistory transactions={transactions} onRefresh={fetchData} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <TransactionForm onSuccess={fetchData} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
