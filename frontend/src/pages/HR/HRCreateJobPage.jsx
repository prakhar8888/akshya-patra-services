import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiBriefcase } from 'react-icons/fi';

function HRCreateJobPage() {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [isLoadingLookups, setIsLoadingLookups] = useState(true);

  const selectedSector = watch('sector');

  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = 'Create New Job | HR Panel';
  }, []);

  // --- Fetch Sectors and Designations for the dropdowns ---
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const { data } = await api.get('/sectors');
        setSectors(data.sectors);
      } catch (error) {
        toast.error('Could not load sectors.');
      } finally {
        setIsLoadingLookups(false);
      }
    };
    fetchSectors();
  }, []);

  useEffect(() => {
    if (selectedSector) {
      const fetchDesignations = async () => {
        try {
          const { data } = await api.get(`/designations?sectorId=${selectedSector}`);
          setDesignations(data);
        } catch (error) {
          toast.error('Could not load designations for the selected sector.');
        }
      };
      fetchDesignations();
    } else {
      setDesignations([]);
    }
  }, [selectedSector]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Creating new job posting...');

    try {
      await api.post('/jobs', data);
      toast.success('Job posting created successfully!', { id: toastId });
      reset();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create job posting.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Create New Job Posting</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {isLoadingLookups ? (
            <LoadingSpinner text="Loading form data..." />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sector Dropdown */}
                <div>
                  <label htmlFor="sector" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Sector</label>
                  <select id="sector" {...register('sector', { required: 'Sector is required' })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <option value="">Select a Sector</option>
                    {sectors.map(sector => <option key={sector._id} value={sector._id}>{sector.name}</option>)}
                  </select>
                  {errors.sector && <p className="text-red-500 mt-1 text-sm">{errors.sector.message}</p>}
                </div>

                {/* Designation Dropdown (Dependent on Sector) */}
                <div>
                  <label htmlFor="designation" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Designation</label>
                  <select id="designation" {...register('designation', { required: 'Designation is required' })} disabled={!selectedSector || designations.length === 0} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50">
                    <option value="">Select a Designation</option>
                    {designations.map(desig => <option key={desig._id} value={desig._id}>{desig.name}</option>)}
                  </select>
                  {errors.designation && <p className="text-red-500 mt-1 text-sm">{errors.designation.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">City</label>
                  <input id="city" {...register('city', { required: 'City is required' })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" placeholder="e.g., Lucknow" />
                  {errors.city && <p className="text-red-500 mt-1 text-sm">{errors.city.message}</p>}
                </div>
                <div>
                  <label htmlFor="salary" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Salary Range</label>
                  <input id="salary" {...register('salary', { required: 'Salary is required' })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" placeholder="e.g., ₹15-22 LPA" />
                  {errors.salary && <p className="text-red-500 mt-1 text-sm">{errors.salary.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Job Description</label>
                <textarea id="description" {...register('description', { required: 'Description is required' })} rows="6" className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" placeholder="Enter the job responsibilities, requirements, etc."></textarea>
                {errors.description && <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>}
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-brand-green-dark text-white font-bold rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 flex items-center gap-2">
                  {isSubmitting ? <LoadingSpinner size="sm" /> : <FiBriefcase />}
                  <span>{isSubmitting ? 'Creating...' : 'Create Job'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default HRCreateJobPage;
