import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import useUIStore from './store/useUIStore';

/**
 * This is the root component of our application. It's responsible for setting up
 * global providers and the main application layout.
 */
function App() {
  // Get the theme state and initialization status from our global UI store.
  const theme = useUIStore((state) => state.theme);
  const isThemeInitialized = useUIStore((state) => state.isThemeInitialized);

  // ENTERPRISE FEATURE: Global Theme Management
  // This effect runs whenever the theme state changes in our Zustand store.
  // It applies the 'dark' class to the root <html> element, which enables
  // our entire Tailwind CSS dark mode configuration.
  useEffect(() => {
    if (!isThemeInitialized) return; // Wait for the store to initialize the theme from localStorage

    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);

  }, [theme, isThemeInitialized]);


  return (
    <>
      {/* ENTERPRISE FEATURE: Global Notification System
        By placing the Toaster here, at the top level of our app, we ensure that
        we can trigger beautiful, consistent toast notifications from any component
        in the application. The styling is configured for our elegant theme.
      */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          // --- Light Mode Styles ---
          style: {
            background: '#ffffff', // white
            color: '#1F2937', // brand-gray-dark
            borderRadius: '10px',
            border: '1px solid #E5E7EB', // gray-200
          },
          // --- Dark Mode Styles ---
          dark: {
            style: {
              background: '#374151', // gray-700
              color: '#F9FAFB',      // brand-gray-light
              borderRadius: '10px',
              border: '1px solid #4B5563', // gray-600
            },
          },
          // --- Icon Themes ---
          success: {
            iconTheme: {
              primary: '#10B981', // brand-green
              secondary: '#F9FAFB', // brand-gray-light
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444', // red-500
              secondary: '#F9FAFB', // brand-gray-light
            },
          },
        }}
      />

      {/* The AppRoutes component handles all the page routing logic.
        This keeps our root App component clean and focused on global setup.
      */}
      <AppRoutes />
    </>
  );
}

export default App;
