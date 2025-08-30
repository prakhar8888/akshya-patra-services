import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// --- Inlined SVG Icon to resolve dependency errors ---
const FiFileText = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

// --- Inlined Component: LoadingSpinner ---
// This is included directly to avoid path resolution errors in the preview.
const LoadingSpinner = ({ size = 'md', text, className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
      className={`flex flex-col justify-center items-center gap-4 ${className}`}
    >
      <div className={`animate-spin rounded-full border-green-600 border-t-transparent ${sizeClasses[size]}`}></div>
      {text && <p className="text-gray-600 dark:text-gray-300">{text}</p>}
    </motion.div>
  );
};

// --- Mock API for Isolated Rendering ---
// This is included to allow the component to fetch data in the preview.
const api = {
  get: async (url) => {
    console.log(`Mock API call to: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      data: [
        { _id: 'mock1', name: 'Alice Johnson', appliedForJob: { designation: 'Software Engineer' }, parserConfidence: { overall: 0.65, fields: { name: 0.9, email: 0.8, phone: 0.4 } } },
        { _id: 'mock2', name: 'Bob Williams', appliedForJob: { designation: 'UX Designer' }, parserConfidence: { overall: 0.55, fields: { name: 0.6, email: 0.9, phone: 0.3 } } },
      ]
    };
  }
};


// --- Confidence Bar Sub-component ---
const ConfidenceBar = ({ label, score }) => {
  const scorePercentage = score * 100;
  let barColor = 'bg-green-500';
  if (score < 0.7) barColor = 'bg-yellow-500';
  if (score < 0.4) barColor = 'bg-red-500';

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-bold text-gray-800 dark:text-gray-200">{scorePercentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${scorePercentage}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );
};


function HRReviewQueuePage() {
  const [reviewCandidates, setReviewCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = 'Manual Review Queue | HR Panel';
  }, []);

  const fetchReviewQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use the correct, dedicated endpoint
      const { data } = await api.get('/candidates/review-queue');
      setReviewCandidates(data);
    } catch (error) {
      toast.error('Failed to fetch review queue.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviewQueue();
  }, [fetchReviewQueue]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-96"><LoadingSpinner text="Fetching Candidates for Review..." /></div>;
    }
    if (reviewCandidates.length === 0) {
      return (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <FiFileText className="mx-auto text-5xl text-green-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">The review queue is empty.</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">All parsed resumes have met the confidence threshold. Great job!</p>
        </div>
      );
    }
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviewCandidates.map((candidate) => (
          <motion.div variants={itemVariants} key={candidate._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
            <div className="flex-grow">
              <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{candidate.name || 'Name Not Found'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Applied for: {candidate.appliedForJob?.designation || 'N/A'}</p>

              <div className="space-y-3 mb-4 border-t dark:border-gray-700 pt-4">
                <ConfidenceBar label="Overall Confidence" score={candidate.parserConfidence.overall} />
                <ConfidenceBar label="Name" score={candidate.parserConfidence.fields.name} />
                <ConfidenceBar label="Email" score={candidate.parserConfidence.fields.email} />
                <ConfidenceBar label="Phone" score={candidate.parserConfidence.fields.phone} />
              </div>
            </div>
            <Link to={`/hr/candidates/${candidate._id}`} className="w-full mt-2 text-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors">
              Review & Correct
            </Link>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Manual Review Queue</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Review candidate data that was parsed from resumes with low confidence.</p>
      </motion.div>
      {renderContent()}
    </div>
  );
}

export default HRReviewQueuePage;

