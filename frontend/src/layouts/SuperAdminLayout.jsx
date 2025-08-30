import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Common/Sidebar';
import Header from '../components/Common/Header';
import { motion } from 'framer-motion';

// --- Best Practice: Define navigation as a configuration constant ---
// Icon names are capitalized to match the keys in our Sidebar's iconMap.
const superAdminNavItems = [
  { name: 'Dashboard', path: '/super-admin/dashboard', icon: 'Dashboard' },
  { name: 'User Management', path: '/super-admin/user-management', icon: 'Users' },
  { name: 'System Settings', path: '/super-admin/settings', icon: 'Settings' },
  { name: 'System Activity', path: '/super-admin/activity-log', icon: 'Activity' },
];

/**
 * Provides the main layout structure (Sidebar, Header) for the Super Admin section.
 * It also includes animated page transitions for a fluid user experience.
 */
function SuperAdminLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar navItems={superAdminNavItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* ENTERPRISE FEATURE: Animated Page Transitions */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-6 py-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
