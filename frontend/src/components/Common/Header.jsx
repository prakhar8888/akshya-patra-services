import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiLogOut, FiMenu, FiChevronDown, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import useUIStore from '../../store/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Custom hook to detect clicks outside of a component
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

function Header() {
  const { user, logout } = useAuth();
  const { toggleSidebar, theme, setTheme } = useUIStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  };

  return (
    <header className="h-20 bg-card text-card-foreground shadow-sm px-6 flex justify-between items-center flex-shrink-0 border-b border-border">
      {/* Left Side: Menu Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-foreground/70 hover:text-primary transition-colors duration-300"
          aria-label="Toggle Sidebar"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Right Side: Theme Toggle, Notifications & User Menu */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="text-foreground/70 hover:text-primary transition-colors duration-300"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <FiSun size={22} /> : <FiMoon size={22} />}
        </button>

        <button className="relative text-foreground/70 hover:text-primary transition-colors duration-300" aria-label="Notifications">
          <FiBell size={22} />
          <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-card animate-pulse"></span>
        </button>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-background font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-xs text-foreground/70">{user.role.replace('-', ' ').toUpperCase()}</p>
              </div>
              <FiChevronDown
                className={`hidden md:block text-foreground/70 transition-transform duration-300 group-hover:text-primary ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute right-0 mt-3 w-60 bg-card rounded-lg shadow-lg ring-1 ring-border z-50 origin-top-right"
                >
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-card-foreground">Signed in as</p>
                      <p className="text-sm text-foreground/70 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 hover:bg-background hover:text-primary transition-colors duration-200"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
