import React, { useState, useEffect } from 'react';
import { FiUpload, FiCheck, FiX, FiBriefcase, FiUserPlus, FiLogIn, FiPhone, FiMail, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/api';
import LoadingSpinner from '../Common/LoadingSpinner';

// A map to associate action types from the backend with icons and colors
const activityConfig = {
  JOB_CREATED: { icon: FiBriefcase, color: 'blue' },
  USER_APPROVED: { icon: FiUserPlus, color: 'green' },
  USER_LOGIN_SUCCESS: { icon: FiLogIn, color: 'gray' },
  CALL_LOGGED: { icon: FiPhone, color: 'purple' },
  EMAIL_QUEUED: { icon: FiMail, color: 'indigo' },
  REPORT_SUBMITTED: { icon: FiFileText, color: 'yellow' },
  DEFAULT: { icon: FiUpload, color: 'blue' },
};

const iconColors = {
  blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
  green: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300',
  red: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300',
  gray: 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300',
  purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300',
};

// A helper to format the activity message
const formatActivityMessage = (log) => {
  const userName = log.user ? log.user.name : 'A candidate';
  switch (log.action) {
    case 'JOB_CREATED':
      return `created the job posting: "${log.details.jobTitle}"`;
    case 'USER_APPROVED':
      return `approved the new user: ${log.details.approvedUserName}`;
    case 'CANDIDATE_APPLY':
      return `applied for a job.`;
    case 'CALL_LOGGED':
      return `logged a call with ${log.details.candidateName}.`;
    case 'EMAIL_QUEUED':
      return `sent an email to ${log.details.candidateName}.`;
    default:
      return log.action.toLowerCase().replace(/_/g, ' ');
  }
};

function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch the 5 most recent activities
        const { data } = await api.get('/activity-logs?limit=5');
        setActivities(data.logs);
      } catch (error) {
        console.error("Failed to fetch recent activities", error);
        // No toast here to avoid cluttering the dashboard
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner text="Loading Activities..." />;
    }
    if (activities.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent activity found.</p>;
    }
    return (
      <ul className="space-y-4">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.action] || activityConfig.DEFAULT;
          const Icon = config.icon;
          return (
            <motion.li
              key={activity._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start"
            >
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${iconColors[config.color]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-semibold">{activity.user ? activity.user.name : 'A candidate'}</span> {formatActivityMessage(activity)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h3>
        <a href="/admin/activity-log" className="text-sm text-brand-green-dark hover:underline">View All</a>
      </div>
      {renderContent()}
    </div>
  );
}

export default RecentActivity;
