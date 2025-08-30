import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { FiEye, FiPhone, FiMail, FiChevronLeft, FiChevronRight, FiSearch, FiUsers } from 'react-icons/fi';
import LogCallModal from '../../components/HR/LogCallModal';
import SendEmailModal from '../../components/HR/SendEmailModal';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// --- NEW: Skeleton Loader for a professional loading experience ---
const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
    <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
    <td className="px-6 py-4 whitespace-nowrap"><div className="flex justify-end gap-2"><div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div><div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div><div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div></div></td>
  </tr>
);


function HRCandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // --- NEW: State for Search and Pagination ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = 'Manage Candidates | HR Panel';
  }, []);

  const fetchCandidates = useCallback(async (currentPage, currentSearch) => {
    setIsLoading(true);
    try {
      // NOTE: This requires the backend /api/candidates endpoint to support ?search= query param.
      const { data } = await api.get(`/candidates?page=${currentPage}&limit=10&search=${currentSearch}`);
      setCandidates(data.candidates);
      setPage(data.page);
      setTotalPages(data.pages);
      setTotalCandidates(data.total);
    } catch (error) {
      toast.error('Failed to fetch candidates.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCandidates(1, searchTerm); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, fetchCandidates]);

  useEffect(() => {
    fetchCandidates(page, searchTerm);
  }, [page]); // Only refetch when page changes

  const handleLogCall = (candidate) => {
    setSelectedCandidate(candidate);
    setIsCallModalOpen(true);
  };

  const handleSendEmail = (candidate) => {
    setSelectedCandidate(candidate);
    setIsEmailModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Interviewing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    Hired: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Manage Candidates</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidates..."
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Applied For</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? [...Array(10)].map((_, i) => <TableRowSkeleton key={i} />) :
                candidates.map((candidate) => (
                  <motion.tr key={candidate._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/hr/candidates/${candidate._id}`} className="text-sm font-semibold text-brand-green-dark hover:underline">{candidate.name}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{candidate.email}<br/>{candidate.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', statusColors[candidate.status] || 'bg-gray-100 text-gray-800')}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{candidate.appliedForJob?.designation || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleLogCall(candidate)} className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300" title="Log Call"><FiPhone /></button>
                      <button onClick={() => handleSendEmail(candidate)} className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300" title="Send Email"><FiMail /></button>
                      <Link to={`/hr/candidates/${candidate._id}`} className="p-2 inline-block rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" title="View Details"><FiEye /></Link>
                    </td>
                  </motion.tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {!isLoading && totalCandidates > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-400">Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, totalCandidates)}</span> of {totalCandidates} results</p>
            <div className="flex items-center">
              <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="p-2 disabled:opacity-50"><FiChevronLeft /></button>
              <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
              <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} className="p-2 disabled:opacity-50"><FiChevronRight /></button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isCallModalOpen && <LogCallModal candidate={selectedCandidate} onClose={() => setIsCallModalOpen(false)} onSuccess={() => fetchCandidates(page, searchTerm)} />}
        {isEmailModalOpen && <SendEmailModal candidate={selectedCandidate} onClose={() => setIsEmailModalOpen(false)} onSuccess={() => fetchCandidates(page, searchTerm)} />}
      </AnimatePresence>
    </div>
  );
};

export default HRCandidatesPage;
