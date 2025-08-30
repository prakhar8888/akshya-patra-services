import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiFileText, FiXCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../Common/LoadingSpinner';

const sourceOptions = ['WhatsApp', 'LinkedIn', 'Email', 'Naukri.com'];

function ResumeUpload() {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const file = watch('resume');

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setValue('resume', selectedFile, { shouldValidate: true });
    }
  };

  const clearFile = () => {
    setValue('resume', null, { shouldValidate: true });
    // Also reset the file input element itself
    const fileInput = document.getElementById('resume-upload-input');
    if (fileInput) fileInput.value = '';
  };

  const handleDragEvents = useCallback((e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e) => {
    handleDragEvents(e, false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setValue('resume', droppedFile, { shouldValidate: true });
    }
  }, [handleDragEvents, setValue]);

  const onSubmit = async (data) => {
    setIsUploading(true);
    const toastId = toast.loading('Uploading resume...');

    const formData = new FormData();
    formData.append('resume', data.resume);
    formData.append('source', data.source);
    // The backend will get name/email/phone from the resume parser for website uploads,
    // but for HR uploads, we might need more fields in the future.
    // For now, we'll rely on the backend to handle what it can.

    try {
      await api.post('/candidates/hr-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Resume uploaded successfully!', { id: toastId });
      reset();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload resume.';
      toast.error(message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Upload</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="resume-upload-input"
            className={`w-full flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed transition-colors duration-300
              ${isDragging ? 'border-brand-green-dark bg-green-50 dark:bg-green-900/50' : 'border-gray-300 dark:border-gray-600'}
              ${errors.resume ? 'border-red-500' : ''}
              cursor-pointer hover:border-brand-green-dark`}
            onDragEnter={(e) => handleDragEvents(e, true)}
            onDragLeave={(e) => handleDragEvents(e, false)}
            onDragOver={(e) => handleDragEvents(e, true)}
            onDrop={handleDrop}
          >
            <FiUploadCloud className={`text-3xl ${isDragging ? 'text-brand-green-dark' : 'text-gray-400 dark:text-gray-500'}`} />
            <span className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              {isDragging ? 'Drop the file here!' : 'Click to upload or drag & drop'}
            </span>
            <input
              id="resume-upload-input"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              {...register('resume', { required: 'A resume file is required.' })}
              onChange={onFileChange}
            />
          </label>
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <FiFileText className="text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                </div>
                <button type="button" onClick={clearFile} className="text-gray-500 hover:text-red-500">
                  <FiXCircle />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {errors.resume && <p className="text-red-500 mt-1 text-sm">{errors.resume.message}</p>}
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
          <select
            id="source"
            {...register('source', { required: 'Please select a source.' })}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-dark focus:border-transparent outline-none transition"
          >
            <option value="">Select Source</option>
            {sourceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {errors.source && <p className="text-red-500 mt-1 text-sm">{errors.source.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isUploading ? <LoadingSpinner size="sm" /> : 'Upload & Parse'}
        </button>
      </form>
    </motion.div>
  );
}

export default ResumeUpload;
