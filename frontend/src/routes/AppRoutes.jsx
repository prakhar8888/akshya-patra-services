import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- Layouts ---
import AdminLayout from '../layouts/AdminLayout';
import CandidateLayout from '../layouts/CandidateLayout';
import HRLayout from '../layouts/HRLayout';
import SuperAdminLayout from '../layouts/SuperAdminLayout';

// --- Components ---
import ProtectedRoute from './ProtectedRoute';

// --- Page Imports ---

// Admin Pages
import AdminCreateJobPage from '../pages/Admin/AdminCreateJobPage';
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import AdminHrManagementPage from '../pages/Admin/AdminHrManagementPage';
import AdminManageDesignationsPage from '../pages/Admin/AdminManageDesignationsPage';
import AdminManageJobsPage from '../pages/Admin/AdminManageJobsPage';
import AdminManageSectorsPage from '../pages/Admin/AdminManageSectorsPage';
import AdminViewReportsPage from '../pages/Admin/AdminViewReportsPage';

// Candidate Pages
import CandidateApplyPage from '../pages/Candidate/CandidateApplyPage';
import CandidateHomePage from '../pages/Candidate/CandidateHomePage';

// HR Pages
import HRCandidateDetailsPage from '../pages/HR/HRCandidateDetailsPage';
import HRCandidatesPage from '../pages/HR/HRCandidatesPage';
import HRCreateJobPage from '../pages/HR/HRCreateJobPage';
import HRDashboardPage from '../pages/HR/HRDashboardPage';
import HRReviewQueuePage from '../pages/HR/HRReviewQueuePage';
import HRSubmitReportPage from '../pages/HR/HRSubmitReportPage';

// Shared Pages
import ActivityLogPage from '../pages/Shared/ActivityLogPage';
import AuthSuccessPage from '../pages/Shared/AuthSuccessPage';
import LoginPage from '../pages/Shared/LoginPage';
import NotFoundPage from '../pages/Shared/NotFoundPage';

// Super Admin Pages
import SuperAdminDashboardPage from '../pages/SuperAdmin/SuperAdminDashboardPage';
import SuperAdminSettingsPage from '../pages/SuperAdmin/SuperAdminSettingsPage';
import SuperAdminUserManagementPage from '../pages/SuperAdmin/SuperAdminUserManagementPage';

const AppRoutes = () => {
  const location = useLocation();

  return (
    // ENTERPRISE FEATURE: Animated Page Transitions
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* === SHARED & PUBLIC ROUTES === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />

        <Route element={<CandidateLayout />}>
          <Route path="/" element={<CandidateHomePage />} />
          <Route path="/apply/:jobId" element={<CandidateApplyPage />} />
        </Route>

        {/* === HR ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={['recruiter', 'hr-manager', 'admin', 'super-admin']} />}>
          <Route path="/hr" element={<HRLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<HRDashboardPage />} />
            <Route path="candidates" element={<HRCandidatesPage />} />
            <Route path="candidates/:candidateId" element={<HRCandidateDetailsPage />} />
            <Route path="review-queue" element={<HRReviewQueuePage />} />
            <Route path="create-job" element={<HRCreateJobPage />} />
            <Route path="submit-report" element={<HRSubmitReportPage />} />
          </Route>
        </Route>

        {/* === ADMIN ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'super-admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="manage-sectors" element={<AdminManageSectorsPage />} />
            <Route path="manage-designations" element={<AdminManageDesignationsPage />} />
            <Route path="create-job" element={<AdminCreateJobPage />} />
            <Route path="manage-jobs" element={<AdminManageJobsPage />} />
            <Route path="view-reports" element={<AdminViewReportsPage />} />
            <Route path="manage-hr" element={<AdminHrManagementPage />} />
            <Route path="activity-log" element={<ActivityLogPage />} />
          </Route>
        </Route>

        {/* === SUPER ADMIN ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={['super-admin']} />}>
            <Route path="/super-admin" element={<SuperAdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SuperAdminDashboardPage />} />
              <Route path="user-management" element={<SuperAdminUserManagementPage />} />
              <Route path="settings" element={<SuperAdminSettingsPage />} />
              <Route path="activity-log" element={<ActivityLogPage />} />
            </Route>
        </Route>

        {/* === NOT FOUND ROUTE === */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;

