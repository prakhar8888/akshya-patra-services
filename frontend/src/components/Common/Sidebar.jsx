import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiActivity, FiSettings, FiUsers, FiShield, FiBriefcase, FiFileText, FiLogOut } from 'react-icons/fi';
import clsx from 'clsx';
import useUIStore from '../../store/useUIStore';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// A map to dynamically render icons based on the nav item's configuration
const iconMap = {
  Dashboard: FiGrid,
  Activity: FiActivity,
  Settings: FiSettings,
  Users: FiUsers,
  Briefcase: FiBriefcase,
  FileText: FiFileText,
  Folder: FiFileText, // Assuming Folder and FileText can share an icon
  Tag: FiFileText,
  PlusSquare: FiFileText,
};

// --- NEW: Elegant SVG Logo Component ---
const Logo = ({ isSidebarOpen }) => (
  <a href="/" className="flex items-center justify-center gap-2 h-20 flex-shrink-0">
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40Z" fill="url(#paint0_linear_1_2)"/>
      <path d="M22 20H26L30 34H26L25 29H23L22 34H18L22 20ZM24 22.8L23 27H25L24 22.8Z" fill="url(#paint1_linear_1_2)"/>
      <defs>
        <linearGradient id="paint0_linear_1_2" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
        <linearGradient id="paint1_linear_1_2" x1="24" y1="20" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
      </defs>
    </svg>
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          exit={{ opacity: 0, x: -20 }}
          className="text-2xl font-bold text-gray-800 dark:text-white whitespace-nowrap"
        >
          Akshaya Patra
        </motion.span>
      )}
    </AnimatePresence>
  </a>
);

function Sidebar({ navItems = [] }) {
  const { isSidebarOpen } = useUIStore();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const sidebarVariants = {
    open: { width: '16rem', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '5rem', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isSidebarOpen ? 'open' : 'closed'}
      className="bg-white dark:bg-gray-800 shadow-lg flex flex-col h-screen border-r border-gray-200 dark:border-gray-700"
    >
      <Logo isSidebarOpen={isSidebarOpen} />

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || FiGrid; // Default icon
          return (
            <li key={item.name} className="list-none">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-4 p-3 rounded-lg transition-colors duration-200',
                    {
                      'bg-brand-green-dark text-white shadow-md': isActive,
                      'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700': !isActive,
                    },
                    !isSidebarOpen && 'justify-center'
                  )
                }
                title={item.name} // Show tooltip when collapsed
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          );
        })}
      </nav>

      {/* --- NEW: User Profile Footer --- */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green-dark rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {user?.name.charAt(0).toUpperCase()}
            </div>
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
                        exit={{ opacity: 0, x: -10 }}
                        className="overflow-hidden"
                    >
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role.replace('-', ' ').toUpperCase()}</p>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isSidebarOpen && (
                     <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.2 } }}
                        exit={{ opacity: 0 }}
                        onClick={handleLogout}
                        className="ml-auto text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <FiLogOut />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
