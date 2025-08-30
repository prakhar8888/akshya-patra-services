import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/Common/LoadingSpinner';

/**
 * A Higher-Order Component that acts as a security guard for routes.
 * It checks for authentication and authorization before rendering the requested page.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  // Set a loading title for better UX and SEO during the brief loading state
  useEffect(() => {
    if (isLoading) {
      document.title = 'Verifying Access... | Akshaya Patra Services';
    }
  }, [isLoading]);

  // 1. While the AuthContext is checking for a user session, display a professional loading screen.
  // This prevents content flashing and provides a smooth user experience.
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-background/80 backdrop-blur-sm"
      >
        <LoadingSpinner size="lg" text="Verifying Access..." />
      </motion.div>
    );
  }

  // 2. After loading, if there is no authenticated user, redirect to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If a user exists, check if their role is included in the list of allowed roles for this route.
  const isAuthorized = user && allowedRoles.includes(user.role);

  if (isAuthorized) {
    // 4a. If authorized, render the child component (the requested page).
    return <Outlet />;
  } else {
    // 4b. If not authorized, redirect them to their default dashboard.
    // This prevents users from accessing pages they don't have permission for.
    const homePath = `/${user.role.split('-')[0]}/dashboard`;
    return <Navigate to={homePath || '/'} replace />;
  }
};

export default ProtectedRoute;
