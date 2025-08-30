import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiUser, FiMail, FiPhone, FiFileText, FiBriefcase, FiMapPin, FiArrowLeft, FiSave, FiMessageSquare, FiPhoneCall } from 'react-icons/fi';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';

// --- Best Practice: Extracted Communication Log into its own component ---
function CommunicationLog({ candidateId, notes, callLogs, emailLogs, onNoteAdded }) {
  const [activeTab, setActiveTab] = useState('notes');
  const { register, handleSubmit, reset } = useForm();

  const onNoteSubmit = async (data) => {
    const toastId = toast.loading('Adding note...');
    try {
      await api.post('/notes', { candidateId, content: data.noteContent });
      toast.success('Note added successfully!', { id: toastId });
      reset();
      onNoteAdded(); // Tell the parent component to refresh
    } catch (error) {
      toast.error('Failed to add note.', { id: toastId });
    }
  };

  const tabs = ['Internal Notes', 'Call History', 'Email History'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          {tabs.map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName.split(' ')[0].toLowerCase())}
              className={clsx(
                'relative py-3 px-1 text-sm font-semibold whitespace-nowrap',
                activeTab === tabName.split(' ')[0].toLowerCase()
                  ? 'text-brand-green-dark dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              {tabName}
              {activeTab === tabName.split(' ')[0].toLowerCase() && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green-dark" layoutId="underline" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div>
                <form onSubmit={handleSubmit(onNoteSubmit)} className="space-y-3 mb-6">
                  <textarea {...register('noteContent', { required: true })} rows="3" className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" placeholder="Add a new internal note..."></textarea>
                  <button type="submit" className="w-full bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-green-light">Add Note</button>
                </form>
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {notes.map(note => <li key={note._id} className="flex items-start gap-3 border-t dark:border-gray-700 pt-3"><div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center"><FiMessageSquare className="text-gray-500 dark:text-gray-300" /></div><div><p className="text-sm text-gray-700 dark:text-gray-200">{note.content}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{note.author.name} · {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</p></div></li>)}
                </ul>
              </div>
            )}
            {/* Calls Tab */}
            {activeTab === 'calls' && (
              <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {callLogs.map(log => <li key={log._id} className="flex items-start gap-4 border-t dark:border-gray-700 pt-3"><div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center"><FiPhoneCall className="text-green-600 dark:text-green-300" /></div><div><p className="font-semibold text-gray-800 dark:text-gray-100">{log.outcome}</p><p className="text-sm text-gray-600 dark:text-gray-300">{log.notes}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.hrManager.name} · {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</p></div></li>)}
              </ul>
            )}
            {/* Emails Tab */}
            {activeTab === 'emails' && (
              <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                 {emailLogs.map(log => <li key={log._id} className="flex items-start gap-4 border-t dark:border-gray-700 pt-3"><div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center"><FiMail className="text-blue-600 dark:text-blue-300" /></div><div><p className="font-semibold text-gray-800 dark:text-gray-100">{log.subject}</p><p className="text-sm text-gray-600 dark:text-gray-300 truncate">{log.body}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.sender.name} · {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</p></div></li>)}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- NEW: Skeleton Loader for the Details Page ---
const DetailsPageSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="space-y-3">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 border-t dark:border-gray-700 pt-6">
                {[...Array(5)].map((_, i) => <div key={i} className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>)}
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
    </div>
);


function HRCandidateDetailsPage() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [callLogs, setCallLogs] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');

  const fetchAllDetails = useCallback(async () => {
    // Don't set loading to true on refetch, to avoid UI flicker
    try {
      const [candidateRes, callsRes, emailsRes, notesRes] = await Promise.all([
        api.get(`/candidates/${id}`),
        api.get(`/call-logs/${id}`),
        api.get(`/emails/${id}`),
        api.get(`/notes/${id}`)
      ]);
      setCandidate(candidateRes.data);
      setCallLogs(callsRes.data);
      setEmailLogs(emailsRes.data);
      setNotes(notesRes.data);
      setStatus(candidateRes.data.status);
    } catch (error) {
      toast.error('Failed to fetch candidate details.');
      setCandidate(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAllDetails();
  }, [fetchAllDetails]);

  // --- SEO Best Practice: Set a dynamic title for the page ---
  useEffect(() => {
    if (candidate) {
      document.title = `${candidate.name} | HR Panel`;
    }
  }, [candidate]);

  const handleStatusUpdate = async () => {
    const toastId = toast.loading('Updating status...');
    try {
      const { data } = await api.put(`/candidates/${id}/status`, { status });
      toast.success('Candidate status updated!', { id: toastId });
      setCandidate(data); // Update local state with the returned object
      setStatus(data.status);
    } catch (error) {
      toast.error('Failed to update status.', { id: toastId });
    }
  };

  if (isLoading) {
    return <DetailsPageSkeleton />;
  }

  if (!candidate) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">Candidate Not Found</h2>
        <Link to="/hr/candidates" className="text-brand-green-dark hover:underline">&larr; Back to Candidates List</Link>
      </div>
    );
  }

  // CRITICAL FIX: Use 'resumePath' and construct the full URL
  const resumeUrl = `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${candidate.resumePath}`;

  return (
    <div>
      <Link to="/hr/candidates" className="inline-flex items-center gap-2 text-brand-green-dark dark:text-green-400 hover:underline mb-6">
        <FiArrowLeft />Back to All Candidates
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
                <FiUser size={48} className="text-brand-green-dark" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{candidate.name}</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">{candidate.appliedForJob?.designation || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white">
                    <option value="Pending">Pending</option><option value="Reviewed">Reviewed</option><option value="Interviewing">Interviewing</option><option value="Hired">Hired</option><option value="Rejected">Rejected</option>
                </select>
                <button onClick={handleStatusUpdate} className="p-2 bg-brand-green-dark text-white rounded-lg hover:bg-brand-green-light"><FiSave /></button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 border-t dark:border-gray-700 pt-6 text-sm">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300"><FiMail className="text-gray-400" /><span>{candidate.email}</span></div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300"><FiPhone className="text-gray-400" /><span>{candidate.phone}</span></div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300"><FiMapPin className="text-gray-400" /><span>{candidate.city}</span></div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300"><FiBriefcase className="text-gray-400" /><span>{candidate.totalExperience} years experience</span></div>
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-brand-green-dark hover:underline"><FiFileText /><span>View Resume</span></a>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <CommunicationLog
          candidateId={id}
          notes={notes}
          callLogs={callLogs}
          emailLogs={emailLogs}
          onNoteAdded={fetchAllDetails}
        />
      </motion.div>
    </div>
  );
}

export default HRCandidateDetailsPage;
