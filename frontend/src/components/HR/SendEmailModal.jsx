import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { FiX, FiMail } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../Common/LoadingSpinner';

// --- NEW: Pre-defined Email Templates ---
const emailTemplates = {
  interview: {
    subject: 'Invitation to Interview with Akshaya Patra Services',
    body: (name) => `Dear ${name},\n\nThank you for your interest in a position at Akshaya Patra Services. We were impressed with your background and would like to invite you for an interview to discuss your qualifications further.\n\nPlease let us know what time works best for you in the coming days.\n\nBest regards,\nThe Hiring Team`,
  },
  rejection: {
    subject: 'Update on Your Application with Akshaya Patra Services',
    body: (name) => `Dear ${name},\n\nThank you for taking the time to apply for a position at Akshaya Patra Services. We received a large number of applications, and after careful consideration, we have decided to move forward with other candidates whose qualifications more closely match the requirements of the role.\n\nWe wish you the best of luck in your job search.\n\nSincerely,\nThe Hiring Team`,
  },
  offer: {
    subject: 'Job Offer from Akshaya Patra Services',
    body: (name) => `Dear ${name},\n\nFollowing our recent interview, we are delighted to offer you the position at Akshaya Patra Services. We were very impressed with your skills and experience and believe you would be a great asset to our team.\n\nWe will be sending over the official offer letter shortly. We look forward to welcoming you to the team!\n\nBest regards,\nThe Hiring Team`,
  },
  custom: {
    subject: '',
    body: () => '',
  }
};


function SendEmailModal({ candidate, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedTemplate = watch('template');

  // Effect to update the form when a template is selected
  useEffect(() => {
    if (selectedTemplate && emailTemplates[selectedTemplate]) {
      const template = emailTemplates[selectedTemplate];
      setValue('subject', template.subject);
      setValue('body', template.body(candidate.name));
    }
  }, [selectedTemplate, setValue, candidate.name]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Sending email...');

    try {
      // The backend emailService is smart enough to handle either a template or a raw body/subject
      const payload = {
        candidateId: candidate._id,
        template: data.template,
        context: {
            name: candidate.name,
            subject: data.subject,
            body: data.body,
            loginUrl: `${window.location.origin}/login`
        }
      };

      await api.post('/emails/send', payload);

      toast.success('Email sent successfully!', { id: toastId });
      onSuccess();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send email.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } };

  return (
    <AnimatePresence>
      <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
        <motion.div variants={modalVariants} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                    <FiMail className="text-brand-green-dark" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Send Email</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To: {candidate.name}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><FiX size={24} /></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="template" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Use a Template</label>
              <select id="template" {...register('template')} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option value="custom">Custom Email</option>
                <option value="interview">Interview Invitation</option>
                <option value="rejection">Rejection Letter</option>
                <option value="offer">Offer Letter</option>
              </select>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Subject</label>
              <input id="subject" {...register('subject', { required: 'Subject is required' })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
              {errors.subject && <p className="text-red-500 mt-1 text-sm">{errors.subject.message}</p>}
            </div>
            <div>
              <label htmlFor="body" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Body</label>
              <textarea id="body" {...register('body', { required: 'Email body is required' })} rows="8" className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"></textarea>
              {errors.body && <p className="text-red-500 mt-1 text-sm">{errors.body.message}</p>}
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-brand-green-dark text-white font-bold rounded-lg hover:bg-brand-green-light disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                {isSubmitting ? <LoadingSpinner size="sm" /> : 'Send Email'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SendEmailModal;
