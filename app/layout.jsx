import "./globals.scss";

import Sidebar from "../components/Sidebar/Sidebar";

export const metadata = {
  title: "Personal Finance Tracker",
  description: "Track your income and expenses simply.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div className="main-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
