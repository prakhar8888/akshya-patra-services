import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { FiX, FiPhoneCall } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../Common/LoadingSpinner'; // Corrected the import path

/**
 * A modal form for HR users to log a phone call with a candidate.
 * @param {object} props - The component props.
 * @param {object} props.candidate - The candidate object for whom the call is being logged.
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onSuccess - Callback function to run after a call is successfully logged.
 */
function LogCallModal({ candidate, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Logging call...');

    try {
      // CRITICAL FIX: Convert minutes from form to seconds for the backend
      const payload = {
        ...data,
        candidateId: candidate._id,
        callDuration: data.callDuration * 60,
      };

      await api.post('/call-logs', payload);

      toast.success('Call logged successfully!', { id: toastId });
      onSuccess(); // Tell the parent page to refresh its data
      onClose();   // Close the modal
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to log call.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      >
        <motion.div
          variants={modalVariants}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                 <FiPhoneCall className="text-brand-green-dark" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Log a Call</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">For {candidate.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Fields */}
            <div>
              <label htmlFor="callDuration" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Call Duration (in minutes)</label>
              <input
                id="callDuration"
                type="number"
                {...register('callDuration', {
                  required: 'Duration is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Duration cannot be negative' }
                })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-dark focus:border-transparent outline-none transition"
                placeholder="e.g., 15"
              />
              {errors.callDuration && <p className="text-red-500 mt-1 text-sm">{errors.callDuration.message}</p>}
            </div>

            <div>
              <label htmlFor="outcome" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Outcome</label>
              <select
                id="outcome"
                {...register('outcome', { required: 'Outcome is required' })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-dark focus:border-transparent outline-none transition appearance-none"
              >
                <option value="">Select Outcome</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="No Answer">No Answer</option>
                <option value="Follow Up Required">Follow Up Required</option>
                <option value="Wrong Number">Wrong Number</option>
              </select>
              {errors.outcome && <p className="text-red-500 mt-1 text-sm">{errors.outcome.message}</p>}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Notes</label>
              <textarea
                id="notes"
                {...register('notes')}
                rows="4"
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-dark focus:border-transparent outline-none transition"
                placeholder="Add any relevant notes from the call..."
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-brand-green-dark text-white font-bold rounded-lg hover:bg-brand-green-light disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : 'Save Log'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LogCallModal;
