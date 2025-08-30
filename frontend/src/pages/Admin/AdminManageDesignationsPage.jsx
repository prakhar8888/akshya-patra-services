import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiPlus, FiX, FiEdit, FiTrash2, FiTag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Edit Designation Modal Component ---
const EditDesignationModal = ({ designation, sectors, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: designation.name,
      sector: designation.sector._id,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Updating designation...');
    try {
      // NOTE: This requires a PUT /api/designations/:id endpoint on the backend.
      await api.put(`/designations/${designation._id}`, { name: data.name, sectorId: data.sector });
      toast.success('Designation updated successfully!', { id: toastId });
      onSuccess();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update designation.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Designation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form fields are similar to the create form */}
          <button type="submit" disabled={isSubmitting} className="w-full mt-4 py-3 bg-brand-green-dark text-white font-bold rounded-lg hover:bg-brand-green-light disabled:bg-gray-400">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};


// --- Main Page Component ---
function AdminManageDesignationsPage() {
  const [sectors, setSectors] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const fetchData = useCallback(async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const [sectorsRes, designationsRes] = await Promise.all([
        api.get('/sectors'),
        api.get(`/designations?page=${currentPage}&limit=10`)
      ]);
      setSectors(sectorsRes.data.sectors);
      setDesignations(designationsRes.data.designations);
      setPage(designationsRes.data.page);
      setTotalPages(designationsRes.data.pages);
    } catch (error) {
      toast.error('Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Manage Designations | Admin Panel';
    fetchData(page);
  }, [page, fetchData]);

  const onSubmit = async (data) => {
    const toastId = toast.loading('Creating designation...');
    try {
      await api.post('/designations', { name: data.name, sectorId: data.sector });
      toast.success('Designation created successfully!', { id: toastId });
      reset();
      fetchData(1); // Refresh list and go to first page
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create designation.';
      toast.error(message, { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      const toastId = toast.loading('Deleting designation...');
      try {
        // NOTE: This requires a DELETE /api/designations/:id endpoint on the backend.
        await api.delete(`/designations/${id}`);
        toast.success('Designation deleted!', { id: toastId });
        fetchData(page); // Refresh list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete.', { id: toastId });
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Manage Job Designations</motion.h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"><FiPlus /> Create New</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields... */}
          </form>
        </motion.div>

        {/* Designations List */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"><FiTag /> Existing Designations</h2>
          {isLoading ? <LoadingSpinner /> : (
            <>
              <table className="w-full text-left">
                {/* Table Head */}
                <tbody>
                  {designations.map((d) => (
                    <tr key={d._id}>
                      {/* Table data */}
                      <td>
                        <button onClick={() => { setSelectedDesignation(d); setIsEditModalOpen(true); }} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full"><FiEdit /></button>
                        <button onClick={() => handleDelete(d._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
            </>
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {isEditModalOpen && <EditDesignationModal designation={selectedDesignation} sectors={sectors} onClose={() => setIsEditModalOpen(false)} onSuccess={() => fetchData(page)} />}
      </AnimatePresence>
    </div>
  );
}

export default AdminManageDesignationsPage;
