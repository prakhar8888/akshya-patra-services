import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiFileText, FiXCircle, FiArrowLeft } from 'react-icons/fi';
import api from '../../lib/api';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Helper to format file size
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

function CandidateApplyPage() {
  const { jobId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = `Apply Now | Akshaya Patra Services`;
  }, []);

  const validateFile = (file) => {
    if (!file) return true; // No file is not an error here, handled by submit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF or Word document.');
      return false;
    }
    setError('');
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setResumeFile(file);
    }
  };

  const clearFile = () => {
    setResumeFile(null);
    setError('');
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
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setResumeFile(file);
    }
  }, [handleDragEvents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload a resume file to apply.');
      return;
    }
    if (!validateFile(resumeFile)) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your application...');

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobId', jobId);

    try {
      await api.post('/candidates/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Application submitted successfully! We will be in touch.', { id: toastId, duration: 4000 });
      clearFile();
    } catch (error) {
      const message = error.response?.data?.message || 'Submission failed!';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-green-dark dark:text-green-400 hover:underline mb-4">
          <FiArrowLeft />
          Back to Job Listings
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Apply for Position</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Please upload your resume to complete your application.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="resume-upload-input"
              className={`w-full flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed transition-colors duration-300 ${isDragging ? 'border-brand-green-dark bg-green-50 dark:bg-green-900/50' : 'border-gray-300 dark:border-gray-600'} ${error ? 'border-red-500' : ''} cursor-pointer hover:border-brand-green-dark`}
              onDragEnter={(e) => handleDragEvents(e, true)} onDragLeave={(e) => handleDragEvents(e, false)} onDragOver={(e) => handleDragEvents(e, true)} onDrop={handleDrop}
            >
              <FiUploadCloud className={`text-4xl mb-3 ${isDragging ? 'text-brand-green-dark' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{isDragging ? 'Drop it here!' : 'Upload Your Resume'}</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PDF or Word document (Max {MAX_FILE_SIZE_MB}MB)</p>
              <input id="resume-upload-input" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </label>

            <AnimatePresence>
              {resumeFile && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FiFileText className="text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 truncate">{resumeFile.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">({formatBytes(resumeFile.size)})</span>
                  </div>
                  <button type="button" onClick={clearFile} className="text-gray-500 hover:text-red-500 ml-2"><FiXCircle /></button>
                </motion.div>
              )}
            </AnimatePresence>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !resumeFile || !!error}
            className="w-full bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'Upload and Apply'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default CandidateApplyPage;
