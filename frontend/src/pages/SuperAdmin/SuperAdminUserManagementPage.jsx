import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiPlus, FiX, FiEdit, FiTrash2, FiUserCheck, FiUserX, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// --- Edit User Modal Component ---
const EditUserModal = ({ user, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user.name, email: user.email, role: user.role },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Updating user...');
    try {
      await api.put(`/users/${user._id}`, data);
      toast.success('User updated successfully!', { id: toastId });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Edit User: {user.name}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form fields for editing user */}
            <button type="submit" disabled={isSubmitting} className="w-full mt-4 py-3 bg-brand-green-dark text-white font-bold rounded-lg hover:bg-brand-green-light disabled:bg-gray-400">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
      </motion.div>
    </motion.div>
  );
};


// --- Main Page Component ---
function SuperAdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async (currentPage = 1, currentSearch = '') => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/users?page=${currentPage}&limit=10&search=${currentSearch}`);
      setUsers(data.users);
      setPage(data.page);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'User Management | Super Admin';
    const handler = setTimeout(() => fetchData(1, searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm, fetchData]);

  useEffect(() => {
    fetchData(page, searchTerm);
  }, [page]);

  const handleAction = async (action, userId, userName) => {
    const actionMessages = {
      approve: { loading: `Approving ${userName}...`, success: 'User approved!', error: 'Failed to approve.' },
      reject: { loading: `Rejecting ${userName}...`, success: 'User rejected!', error: 'Failed to reject.' },
      deactivate: { loading: `Deactivating ${userName}...`, success: 'User deactivated!', error: 'Failed to deactivate.' },
    };
    if (action === 'deactivate' && !window.confirm('Are you sure you want to deactivate this user?')) return;

    const toastId = toast.loading(actionMessages[action].loading);
    try {
      await api.put(`/users/${userId}/${action}`);
      toast.success(actionMessages[action].success, { id: toastId });
      fetchData(page, searchTerm);
    } catch (error) {
      toast.error(error.response?.data?.message || actionMessages[action].error, { id: toastId });
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">User Management</motion.h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="w-64 pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700" />
            </div>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <>
            <table className="w-full text-left">
                {/* Table Head */}
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="border-b dark:border-gray-700">
                            {/* User Info */}
                            <td className="p-4">
                                <span className={clsx('px-2 py-1 text-xs font-semibold rounded-full', statusColors[user.status])}>{user.status}</span>
                            </td>
                            <td className="p-4">
                                {user.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleAction('approve', user._id, user.name)} className="p-2 text-green-600 hover:bg-green-100 rounded-full"><FiUserCheck /></button>
                                        <button onClick={() => handleAction('reject', user._id, user.name)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><FiUserX /></button>
                                    </>
                                )}
                                <button onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full"><FiEdit /></button>
                                {user.status !== 'inactive' && <button onClick={() => handleAction('deactivate', user._id, user.name)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"><FiTrash2 /></button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination */}
          </>
        )}
      </div>
      <AnimatePresence>
        {isEditModalOpen && <EditUserModal user={selectedUser} onClose={() => setIsEditModalOpen(false)} onSuccess={() => fetchData(page, searchTerm)} />}
      </AnimatePresence>
    </div>
  );
}

export default SuperAdminUserManagementPage;
