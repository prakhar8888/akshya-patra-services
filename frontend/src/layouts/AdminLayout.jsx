import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Common/Sidebar';
import Header from '../components/Common/Header';
import { motion } from 'framer-motion';

// --- Best Practice: Define navigation as a configuration constant ---
// This separates the layout's structure from its data, making it easier to manage.
// Icon names are capitalized to match the keys in our Sidebar's iconMap.
const adminNavItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard' },
  { name: 'Manage Sectors', path: '/admin/manage-sectors', icon: 'Folder' },
  { name: 'Manage Designations', path: '/admin/manage-designations', icon: 'Tag' },
  { name: 'Create Job', path: '/admin/create-job', icon: 'PlusSquare' },
  { name: 'Manage Jobs', path: '/admin/manage-jobs', icon: 'Briefcase' },
  { name: 'View Reports', path: '/admin/view-reports', icon: 'FileText' },
  { name: 'Manage HR', path: '/admin/manage-hr', icon: 'Users' },
  { name: 'Activity Log', path: '/admin/activity-log', icon: 'Activity' },
];

/**
 * Provides the main layout structure (Sidebar, Header) for the Admin section.
 * It also includes animated page transitions for a fluid user experience.
 */
function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar navItems={adminNavItems} />

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

export default AdminLayout;
