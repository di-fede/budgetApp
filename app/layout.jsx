import './globals.css';
import { Suspense } from 'react';

import Sidebar from '../components/Sidebar/Sidebar';

export const metadata = {
  title: 'Personal Finance Tracker',
  description: 'Track your income and expenses simply.',
};

import QueryProvider from './QueryProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bodyDiv">
          <QueryProvider>
            <Suspense>
              <Sidebar />
            </Suspense>
            <div className="main-content">{children}</div>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
