"use client";
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const IncomeExpenseChart = ({ transactions, year }) => {
  const data = useMemo(() => {
    let months = [];

    if (year) {
      // Generate 12 months for the selected year
      months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(Number(year), i, 1);
        return {
          name: format(date, 'MMM'),
          dateObj: date,
          Income: 0,
          Expense: 0,
        };
      });
    } else {
      // Default: Last 6 months
      months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), 5 - i);
        return {
          name: format(date, 'MMM'),
          dateObj: date,
          Income: 0,
          Expense: 0,
        };
      });
    }

    transactions.forEach(tx => {
      const txDate = parseISO(tx.date);
      const monthData = months.find(m => isWithinInterval(txDate, {
        start: startOfMonth(m.dateObj),
        end: endOfMonth(m.dateObj)
      }));

      if (monthData) {
        if (tx.type === 'income') monthData.Income += Number(tx.amount);
        else if (tx.type === 'expense') monthData.Expense += Number(tx.amount);
      }
    });

    return months;
  }, [transactions, year]);

  return (
    <div className="card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', height: '100%', width: "100%"}}>
      <h3 style={{ marginBottom: '1rem', color: '#8b949e', fontSize: '0.9rem', fontWeight: 500 }}>
        Income vs Expenses {year ? `(${year})` : '(Last 6 Months)'}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
          <XAxis dataKey="name" stroke="#8b949e" tick={{ fill: '#8b949e' }} axisLine={false} tickLine={false} />
          <YAxis stroke="#8b949e" tick={{ fill: '#8b949e' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
          <Bar dataKey="Income" fill="var(--success)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expense" fill="var(--danger)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseChart;
