'use client';
import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../lib/storage';
import Modal from '../../components/UI/Modal';
import TransactionForm from '../../components/Transactions/TransactionForm';
import RecentTransactions from '../../components/Dashboard/RecentTransactions'; // Reusing for now

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = () => {
    setTransactions(getTransactions());
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <header
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
          }}
        >
          + Add New
        </button>
      </header>

      {/* Reuse RecentTransactions styling for now, but pass full list */}
      <RecentTransactions transactions={transactions} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <TransactionForm onSuccess={fetchData} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
