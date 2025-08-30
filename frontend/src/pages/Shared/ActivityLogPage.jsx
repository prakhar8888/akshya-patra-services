import React, { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { FiClock, FiChevronLeft, FiChevronRight, FiBriefcase, FiUserPlus, FiLogIn, FiPhone, FiMail, FiFileText, FiSettings, FiTrash2, FiEdit } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

// --- NEW: Skeleton Loader for a professional loading experience ---
const LogItemSkeleton = () => (
  <li className="flex items-start gap-4 animate-pulse">
    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    <div className="flex-grow">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </li>
);

// --- NEW: Dynamic Icon and Message Formatting ---
const activityConfig = {
  JOB_CREATED: { icon: FiBriefcase, color: 'blue' },
  JOB_UPDATED: { icon: FiEdit, color: 'yellow' },
  JOB_DELETED: { icon: FiTrash2, color: 'red' },
  USER_APPROVED: { icon: FiUserPlus, color: 'green' },
  USER_LOGIN_SUCCESS: { icon: FiLogIn, color: 'gray' },
  CALL_LOGGED: { icon: FiPhone, color: 'purple' },
  EMAIL_QUEUED: { icon: FiMail, color: 'indigo' },
  REPORT_SUBMITTED: { icon: FiFileText, color: 'yellow' },
  SETTINGS_UPDATED: { icon: FiSettings, color: 'gray' },
  DEFAULT: { icon: FiClock, color: 'gray' },
};

const formatLogMessage = (log) => {
  const userName = log.user ? log.user.name : 'System';
  switch (log.action) {
    case 'JOB_CREATED': return `created the job: "${log.details.jobTitle}"`;
    case 'USER_APPROVED': return `approved the new user: ${log.details.approvedUserName}`;
    case 'CANDIDATE_APPLY': return `applied for a job.`;
    case 'CALL_LOGGED': return `logged a call with ${log.details.candidateName}.`;
    case 'EMAIL_QUEUED': return `sent an email to ${log.details.candidateName}.`;
    default: return log.action.toLowerCase().replace(/_/g, ' ');
  }
};

function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = 'System Activity Log | Admin Panel';
  }, []);

  const fetchLogs = useCallback(async (currentPage) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/activity-logs?page=${currentPage}&limit=15`);
      setLogs(data.logs);
      setPage(data.page);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch activity logs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">System Activity Log</motion.h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <ul className="space-y-6">
          {isLoading ? (
            [...Array(10)].map((_, i) => <LogItemSkeleton key={i} />)
          ) : logs.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {logs.map((log) => {
                const config = activityConfig[log.action] || activityConfig.DEFAULT;
                const Icon = config.icon;
                return (
                  <motion.li variants={itemVariants} key={log._id} className="flex items-start gap-4">
                    <div className={clsx('flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center', `bg-${config.color}-100 dark:bg-${config.color}-900/50`)}>
                      <Icon className={clsx('h-5 w-5', `text-${config.color}-600 dark:text-${config.color}-300`)} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-semibold">{log.user ? log.user.name : 'System'}</span> {formatLogMessage(log)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">No activity logs found.</p>
          )}
        </ul>
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="p-2 disabled:opacity-50"><FiChevronLeft /></button>
            <span className="text-sm text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} className="p-2 disabled:opacity-50"><FiChevronRight /></button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ActivityLogPage;
