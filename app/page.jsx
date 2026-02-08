'use client';
import React, { useEffect, useState } from 'react';
import {
  getTransactions,
  seedInitialData,
  checkRecurringTransactions,
  initializeCategories,
} from '../lib/storage';
import SummaryCards from '../components/Dashboard/SummaryCards';
import IncomeExpenseChart from '../components/Dashboard/IncomeExpenseChart';
import TransactionHistory from '../components/Dashboard/TransactionHistory'; // New component
import Modal from '../components/UI/Modal';
import TransactionForm from '../components/Transactions/TransactionForm';

import { useSearchParams } from 'next/navigation';
import DashTop from '@/components/Dashboard/dashTop';
import ProtectedRoute from './ui/protectedRoute';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive summary based on transactions and selected year
  const currentYear = searchParams.get('year');
  const summary = React.useMemo(() => {
    let filteredTxs = transactions;

    if (currentYear) {
      filteredTxs = transactions.filter((t) => t.date.startsWith(currentYear));
    }

    const income = filteredTxs
      .filter((t) => t.type === 'income')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const expenses = filteredTxs
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
    };
  }, [transactions, currentYear]);

  const fetchData = () => {
    const txs = getTransactions();
    setTransactions(txs);
  };

  useEffect(() => {
    initializeCategories();
    seedInitialData();
    checkRecurringTransactions(); // Run check logic
    fetchData(); // Load data (including any new recurring ones)
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="dashboard">
      {/* <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      </header> */}

      <DashTop>
        <SummaryCards summary={summary} />

        <div className="chart-container">
          <IncomeExpenseChart transactions={transactions} year={searchParams.get('year')} />
        </div>
      </DashTop>

      <TransactionHistory
        transactions={transactions}
        onRefresh={fetchData}
        year={searchParams.get('year')}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <TransactionForm onSuccess={fetchData} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*='grid-template-columns'] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <React.Suspense fallback={<div className="p-8">Loading Dashboard...</div>}>
      <DashboardContent />
      <ProtectedRoute></ProtectedRoute>
    </React.Suspense>
  );
}
