'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, Receipt, Settings, Menu, X, Wallet } from 'lucide-react';
import styles from './Sidebar.module.scss';
import clsx from 'clsx';

const Sidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentYear = searchParams.get('year');
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    // { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    // { href: '/transactions', label: 'Transactions', icon: Receipt },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const years = ['2026', '2027', '2028', '2029', '2030'];

  return (
    <>
      <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* <aside className={clsx(styles.sidebar, isOpen && styles.open)}> */}
      <aside className={`${isOpen ? 'sidebar__open' : 'sidebar'} `}>
        <div className={styles.brand}>
          <Wallet />
          <span>Finance</span>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__divider" />
          <div className={styles.sectionTitle}>Dashboard</div>

          {years.map((year) => (
            <Link
              key={year}
              href={`/?year=${year}`}
              // className={clsx(styles.link, currentYear === year && styles.active)}
              className={`link ${currentYear === year ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard size={18} style={{ opacity: 0 }} /> {/* Spacer icon */}
              <span>{year}</span>
            </Link>
          ))}
          {links.map((link) => {
            const Icon = link.icon;
            // Exact match for non-year links to keep it simple,
            // or we could ignore query params for main nav items if needed.
            // For now, let's keep it simple. If we are on root / with no year, Dashboard is active.
            // If we have a year, Dashboard is still technically the page, but maybe we want to distinguish?
            // Let's just highlight dashboard if pathname matches and no year selected?
            // Or just keep it standard.
            const isActive = pathname === link.href && !currentYear;

            return (
              <Link
                key={link.href}
                href={link.href}
                // className={clsx(styles.link, isActive && styles.active)}
                className={`link ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
