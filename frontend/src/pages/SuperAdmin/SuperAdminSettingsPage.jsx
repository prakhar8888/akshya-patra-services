import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiSave, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- NEW: Custom, animated, and accessible toggle switch component ---
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-green-dark"></div>
  </label>
);

function SuperAdminSettingsPage() {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      permanentApprovalMode: false,
      confidentialityMode: true,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = 'System Settings | Super Admin';
  }, []);

  // Fetch the current settings from the backend when the page loads
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        reset(data); // Populate the form with the fetched settings
      } catch (error) {
        toast.error('Failed to load system settings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  // Send the updated settings to the backend on submit
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Saving settings...');
    try {
      await api.put('/settings', data);
      toast.success('System settings saved successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to save settings.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner text="Loading Settings..." /></div>;
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Global System Settings</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Permanent Approval Mode Toggle */}
            <div className="flex items-start justify-between p-4 border dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Permanent Approval Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">When enabled, new admin sign-ups are automatically approved.</p>
              </div>
              <Controller
                name="permanentApprovalMode"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ToggleSwitch checked={value} onChange={onChange} />
                )}
              />
            </div>

            {/* Confidentiality Mode Toggle */}
            <div className="flex items-start justify-between p-4 border dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Confidentiality Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">When enabled, sensitive data is hidden from lower-level roles.</p>
              </div>
               <Controller
                name="confidentialityMode"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ToggleSwitch checked={value} onChange={onChange} />
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-green-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : <FiSave />}
                <span>{isSubmitting ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default SuperAdminSettingsPage;
