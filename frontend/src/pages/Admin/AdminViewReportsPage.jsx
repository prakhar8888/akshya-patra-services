import React, { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiCheck, FiX, FiChevronLeft, FiChevronRight, FiFileText } from 'react-icons/fi';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

function AdminViewReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReports = useCallback(async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/reports?page=${currentPage}&limit=5`);
      setReports(data.reports);
      setPage(data.page);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch daily reports.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Review Daily Reports | Admin Panel';
    fetchReports(page);
  }, [page, fetchReports]);

  const handleStatusUpdate = async (reportId, status) => {
    const toastId = toast.loading(`Updating report to ${status}...`);
    try {
      await api.put(`/reports/${reportId}/status`, { status });
      toast.success('Report status updated!', { id: toastId });
      fetchReports(page); // Refresh the list
    } catch (error) {
      toast.error('Failed to update report status.', { id: toastId });
    }
  };

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

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-96"><LoadingSpinner text="Loading Reports..." /></div>;
    }
    if (reports.length === 0) {
      return (
        <div className="text-center py-16">
          <FiFileText className="mx-auto text-5xl text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">No Reports Found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">There are no submitted reports to review at this time.</p>
        </div>
      );
    }
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {reports.map((report) => (
          <motion.div variants={itemVariants} key={report._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{report.hrManager.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(report.reportDate), 'MMMM d, yyyy')}</p>
              </div>
              <span className={clsx('text-xs font-semibold px-3 py-1 rounded-full', {
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300': report.status === 'Submitted',
                'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': report.status === 'Approved',
                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300': report.status === 'Rejected',
              })}>
                {report.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">{report.summary}</p>
            <div className="grid grid-cols-3 gap-4 text-center border-t dark:border-gray-700 pt-4">
              <div><p className="text-xs text-gray-500 dark:text-gray-400">Resumes</p><p className="font-bold text-xl text-gray-800 dark:text-gray-100">{report.resumesUploaded}</p></div>
              <div><p className="text-xs text-gray-500 dark:text-gray-400">Calls</p><p className="font-bold text-xl text-gray-800 dark:text-gray-100">{report.callsMade}</p></div>
              <div><p className="text-xs text-gray-500 dark:text-gray-400">Joined</p><p className="font-bold text-xl text-gray-800 dark:text-gray-100">{report.candidatesJoined}</p></div>
            </div>
            {report.status === 'Submitted' && (
              <div className="flex justify-end gap-4 mt-4 border-t dark:border-gray-700 pt-4">
                <button onClick={() => handleStatusUpdate(report._id, 'Rejected')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-300">
                  <FiX /> Reject
                </button>
                <button onClick={() => handleStatusUpdate(report._id, 'Approved')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 bg-green-100 rounded-md hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-900 dark:text-green-300">
                  <FiCheck /> Approve
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Review Daily Reports</motion.h1>
      {renderContent()}
      {!isLoading && reports.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="p-2 disabled:opacity-50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><FiChevronLeft size={20} /></button>
          <span className="text-sm text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
          <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} className="p-2 disabled:opacity-50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><FiChevronRight size={20} /></button>
        </div>
      )}
    </div>
  );
}

export default AdminViewReportsPage;
