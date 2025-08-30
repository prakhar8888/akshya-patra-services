import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import LoadingSpinner from '../Common/LoadingSpinner';

// Register all the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function DashboardChart({ chartData, isLoading }) {
  // Elegant color palette with dark mode support
  const colors = {
    green: 'rgba(16, 185, 129, 0.6)',
    greenBorder: 'rgba(5, 150, 105, 1)',
    gray: 'rgba(107, 114, 128, 0.6)',
    grayBorder: 'rgba(75, 85, 99, 1)',
    yellow: 'rgba(245, 158, 11, 0.6)',
    yellowBorder: 'rgba(217, 119, 6, 1)',
    line: 'rgba(239, 68, 68, 1)', // A contrasting color for the line graph
    textDark: '#E5E7EB',
    textLight: '#374151',
  };

  const isDarkMode = document.body.classList.contains('dark');
  const textColor = isDarkMode ? colors.textDark : colors.textLight;

  const data = {
    labels: ['Total Candidates', 'Open Jobs', 'Total HRs'],
    datasets: [
      {
        type: 'bar',
        label: 'Overall Totals',
        data: [
          chartData?.totalCandidates,
          chartData?.openJobs,
          chartData?.totalHRs,
        ],
        backgroundColor: [colors.green, colors.yellow, colors.gray],
        borderColor: [colors.greenBorder, colors.yellowBorder, colors.grayBorder],
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'New in Last 30 Days',
        data: [
          chartData?.newCandidatesLast30Days,
          chartData?.newJobsLast30Days,
          null // No "new HRs" stat for this axis
        ],
        borderColor: colors.line,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: {
            size: 14,
          }
        }
      },
      title: {
        display: true,
        text: 'HRMS Overview: Totals vs. Recent Activity',
        color: textColor,
        font: {
          size: 18,
          weight: 'bold',
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total Counts',
          color: textColor,
        },
        ticks: { color: textColor },
        grid: { color: isDarkMode ? '#4B5563' : '#E5E7EB' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Last 30 Days',
          color: textColor,
        },
        ticks: { color: textColor },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
      x: {
        ticks: { color: textColor },
        grid: { color: isDarkMode ? '#4B5563' : '#E5E7EB' },
      }
    },
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-center h-96">
        <LoadingSpinner text="Loading Chart Data..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <div className="h-96 relative">
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
}

export default DashboardChart;
