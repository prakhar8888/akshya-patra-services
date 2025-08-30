import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Common/Sidebar';
import Header from '../components/Common/Header';
import { motion } from 'framer-motion';

// --- Best Practice: Define navigation as a configuration constant ---
const hrNavItems = [
  { name: 'Dashboard', path: '/hr/dashboard', icon: 'Dashboard' },
  { name: 'Candidates', path: '/hr/candidates', icon: 'Users' },
  { name: 'Review Queue', path: '/hr/review-queue', icon: 'Activity' },
  { name: 'Submit Report', path: '/hr/submit-report', icon: 'FileText' },
];

function HRLayout() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar navItems={hrNavItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
            className="container mx-auto px-6 py-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default HRLayout;
