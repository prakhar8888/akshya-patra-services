import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiPlus, FiX, FiUsers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Best Practice: Extract the Modal into its own component ---
const CreateHrUserModal = ({ onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Creating new HR user...');
    try {
      // We explicitly set the role to 'hr-manager' for new HR users
      await api.post('/auth/register', { ...data, role: 'hr-manager' });
      toast.success('HR user created successfully!', { id: toastId });
      reset();
      onSuccess(); // This will trigger a refetch on the parent page
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create New HR User</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Full Name</label>
            <input {...register('name', { required: 'Name is required' })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
            {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Work Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
             {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Password</label>
            <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
            {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-brand-green-dark text-white font-bold rounded-lg hover:bg-brand-green-light disabled:bg-gray-400 flex items-center justify-center">
              {isSubmitting ? <LoadingSpinner size="sm" /> : 'Create User'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// --- Main Page Component ---
function AdminHrManagementPage() {
  const [hrUsers, setHrUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHrUsers = useCallback(async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/users/hr?page=${currentPage}&limit=10`);
      setHrUsers(data.users);
      setPage(data.page);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch HR users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'HR Management | Admin Panel';
    fetchHrUsers(page);
  }, [page, fetchHrUsers]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">HR User Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-green-light transition-transform hover:scale-105">
          <FiPlus /> Add HR User
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {hrUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{user.name}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 capitalize">{user.role.replace('-', ' ')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="p-2 disabled:opacity-50"><FiChevronLeft /></button>
              <span className="text-sm text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
              <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} className="p-2 disabled:opacity-50"><FiChevronRight /></button>
            </div>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && <CreateHrUserModal onClose={() => setIsModalOpen(false)} onSuccess={fetchHrUsers} />}
      </AnimatePresence>
    </div>
  );
}

export default AdminHrManagementPage;
