import React from 'react';
import styles from './RecentTransactions.module.scss'; // Assuming similar styles or shared
import { formatCurrency, formatDate } from '../../lib/utils';

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Transactions</h3>
      <div className={styles.list}>
        {transactions.length === 0 ? (
          <p style={{ color: '#8b949e' }}>No transactions found.</p>
        ) : (
          transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className={styles.item}>
              <div className={styles.info}>
                <div className={styles.category}>{tx.category}</div>
                <div className={styles.desc}>{tx.description}</div>
              </div>
              <div className={styles.right}>
                <div className={styles.amount} style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--text-color)' }}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
                <div className={styles.date}>{formatDate(tx.date)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
