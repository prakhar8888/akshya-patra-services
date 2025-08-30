import React, { useState, useEffect } from 'react';
import StatCard from '../../components/Dashboard/StatCard';
import DashboardChart from '../../components/Dashboard/DashboardChart';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import { FiUsers, FiBriefcase, FiClipboard, FiTrendingUp } from 'react-icons/fi';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = 'Admin Dashboard | Akshaya Patra Services';
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Admin Dashboard</h1>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8"
      >
        {/* Pass isLoading prop to StatCards to show skeleton loaders */}
        <StatCard title="Total Candidates" value={stats?.totalCandidates} icon={<FiUsers />} color="blue" isLoading={isLoading} />
        <StatCard title="Open Jobs" value={stats?.openJobs} icon={<FiBriefcase />} color="yellow" isLoading={isLoading} />
        <StatCard title="Total HRs" value={stats?.totalHRs} icon={<FiClipboard />} color="green" isLoading={isLoading} />
        {/* --- NEW: More Insightful Stats --- */}
        <StatCard title="New Candidates (30d)" value={stats?.newCandidatesLast30Days} icon={<FiTrendingUp />} color="red" isLoading={isLoading} />
        <StatCard title="New Jobs (30d)" value={stats?.newJobsLast30Days} icon={<FiTrendingUp />} color="red" isLoading={isLoading} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <DashboardChart chartData={stats} isLoading={isLoading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <RecentActivity />
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
