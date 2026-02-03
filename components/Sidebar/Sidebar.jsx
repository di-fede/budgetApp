"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Settings, Menu, X, Wallet } from 'lucide-react';
import styles from './Sidebar.module.scss';
import clsx from 'clsx';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transactions', icon: Receipt },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <button 
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <aside className={clsx(styles.sidebar, isOpen && styles.open)}>
        <div className={styles.brand}>
          <Wallet />
          <span>Finance</span>
        </div>

        <nav className={styles.nav}>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={clsx(styles.link, isActive && styles.active)}
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
