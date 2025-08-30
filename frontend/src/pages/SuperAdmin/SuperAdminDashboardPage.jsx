import React, { useState, useEffect } from 'react';
import StatCard from '../../components/Dashboard/StatCard';
import DashboardChart from '../../components/Dashboard/DashboardChart';
import LiveStatusPanel from './LiveStatusPanel';
import { FiUsers, FiFileText, FiBriefcase, FiUserPlus, FiFilePlus } from 'react-icons/fi';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function SuperAdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Super Admin Dashboard | Akshaya Patra Services';
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-3xl font-bold text-foreground mb-6"
        variants={itemVariants}
      >
        Super Admin Dashboard
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        variants={containerVariants}
      >
        <StatCard isLoading={isLoading} title="Total Candidates" value={stats?.totalCandidates} icon={<FiUsers />} color="blue" />
        <StatCard isLoadinga={isLoading} title="Open Jobs" value={stats?.openJobs} icon={<FiBriefcase />} color="yellow" />
        <StatCard isLoading={isLoading} title="Total HRs" value={stats?.totalHRs} icon={<FiUsers />} color="primary" />
        <StatCard isLoading={isLoading} title="New Candidates (30d)" value={stats?.newCandidatesLast30Days} icon={<FiUserPlus />} color="teal" />
        <StatCard isLoading={isLoading} title="New Jobs (30d)" value={stats?.newJobsLast30Days} icon={<FiFilePlus />} color="purple" />
      </motion.div>

      <motion.div
        className="grid garid-cols-1 lg:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <DashboardChart chartData={stats} isLoading={isLoading} />
        </motion.div>
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <LiveStatusPanel />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SuperAdminDashboardPage;
