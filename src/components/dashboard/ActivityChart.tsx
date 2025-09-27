import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ActivityChart: React.FC = () => {
  const theme = useTheme();

  // Generate mock data for the last 7 days
  const generateMockData = () => {
    const labels = [];
    const tokenizations = [];
    const validations = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      
      // Generate random data
      tokenizations.push(Math.floor(Math.random() * 500) + 300);
      validations.push(Math.floor(Math.random() * 300) + 200);
    }
    
    return { labels, tokenizations, validations };
  };

  const { labels, tokenizations, validations } = generateMockData();

  const data = {
    labels,
    datasets: [
      {
        label: 'Tokenizations',
        data: tokenizations,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + '20',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Validations',
        data: validations,
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main + '20',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString() + ' operations';
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Activity Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Token operations over the last 7 days
      </Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        <Line data={data} options={options} />
      </Box>
    </Paper>
  );
};

export default ActivityChart;