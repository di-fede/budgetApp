import React from 'react';
import { formatCurrency, formatDate } from '../../lib/utils';

const RecentTransactions = ({ transactions }) => {
  return (
    <div className=" transactions-card" >
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Transactions</h3>
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p style={{ color: '#8b949e' }}>No transactions found.</p>
        ) : (
          transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="transactions-item">
              <div className="transactions-info">
                <div className="transactions-category">{tx.category}</div>
                <div className="transactions-desc">{tx.description}</div>
              </div>
              <div className="transactions-right">
                <div className="transactions-amount" style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--text-color)' }}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
                <div className="transactions-date">{formatDate(tx.date)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
