import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiFileText } from 'react-icons/fi';

function HRSubmitReportPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      // Set the default date to today in YYYY-MM-DD format
      reportDate: new Date().toISOString().split('T')[0],
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = 'Submit Daily Report | HR Panel';
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Submitting report...');

    try {
      await api.post('/reports', data);
      toast.success('Daily report submitted successfully!', { id: toastId });
      // Reset form to default values, including today's date
      reset({
        reportDate: new Date().toISOString().split('T')[0],
        resumesUploaded: 0,
        callsMade: 0,
        candidatesJoined: 0,
        summary: '',
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit report.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Submit Daily Report</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="reportDate" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Report Date</label>
              <input
                id="reportDate"
                type="date"
                {...register('reportDate', { required: 'Date is required' })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
              {errors.reportDate && <p className="text-red-500 mt-1 text-sm">{errors.reportDate.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="resumesUploaded" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Resumes Uploaded</label>
                <input id="resumesUploaded" type="number" {...register('resumesUploaded', { required: true, valueAsNumber: true, min: 0 })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
              </div>
              <div>
                <label htmlFor="callsMade" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Calls Made</label>
                <input id="callsMade" type="number" {...register('callsMade', { required: true, valueAsNumber: true, min: 0 })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
              </div>
              <div>
                <label htmlFor="candidatesJoined" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Candidates Joined</label>
                <input id="candidatesJoined" type="number" {...register('candidatesJoined', { required: true, valueAsNumber: true, min: 0 })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
              </div>
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Summary of Work</label>
              <textarea
                id="summary"
                {...register('summary', { required: 'Summary is required' })}
                rows="5"
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="Briefly describe your work for the day..."
              ></textarea>
              {errors.summary && <p className="text-red-500 mt-1 text-sm">{errors.summary.message}</p>}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-brand-green-dark text-white font-bold rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 flex items-center gap-2"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : <FiFileText />}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default HRSubmitReportPage;
