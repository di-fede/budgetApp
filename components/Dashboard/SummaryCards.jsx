import React from 'react';
import styles from './SummaryCards.module.scss';
import { formatCurrency } from '../../lib/utils'; // I need to create utils

const SummaryCards = ({ summary }) => {
  const { totalBalance, totalIncome, totalExpenses } = summary;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3>Total Balance</h3>
        <div className={styles.amount}>{formatCurrency(totalBalance)}</div>
      </div>
      <div className={styles.card}>
        <h3>Total Income</h3>
        <div className={styles.amount} style={{ color: 'var(--success)' }}>
          {formatCurrency(totalIncome)}
        </div>
      </div>
      <div className={styles.card}>
        <h3>Total Expenses</h3>
        <div className={styles.amount} style={{ color: 'var(--danger)' }}>
          {formatCurrency(totalExpenses)}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
