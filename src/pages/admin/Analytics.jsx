import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './analytics.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

/* 🎨 Elegant color palette */
const COLORS = {
  primary: '#4F46E5',   // Indigo
  secondary: '#06B6D4', // Cyan
  success: '#16A34A',   // Green
  warning: '#F59E0B',   // Amber
  danger: '#DC2626',    // Red
  purple: '#7C3AED',    // Violet
  slate: '#64748B',     // Gray
  pink: '#EC4899',      // Pink
};

/* 🔧 Common chart options */
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        padding: 10,
      },
    },
  },
};

const doughnutOptions = {
  ...commonOptions,
  cutout: '65%',
};

const Analytics = () => {
  const salesData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [
      {
        label: '2026 Sales',
        data: [12000,15000,18000,22000,25000,40000,38000,36000,34000,32000,30000,28000],
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(79,70,229,0.15)',
        fill: true,
        tension: 0.4,
      },
      {
        label: '2025 Sales',
        data: [10000,12000,16000,20000,23000,35000,34000,32000,30000,28000,26000,24000],
        borderColor: COLORS.warning,
        backgroundColor: 'rgba(245,158,11,0.15)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const viewsData = {
    labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    datasets: [
      {
        label: 'This Week',
        data: [12000,14000,10000,16000,13000,15000,14000],
        backgroundColor: COLORS.secondary,
      },
      {
        label: 'Last Week',
        data: [10000,11000,9000,12000,10000,11000,10000],
        backgroundColor: COLORS.slate,
      },
    ],
  };

  const topProductsData = {
    labels: ['Jeans','Jacket','Sweater','T-Shirt','Cap'],
    datasets: [
      {
        label: 'Sales %',
        data: [75,90,80,60,50],
        backgroundColor: [
          COLORS.primary,
          COLORS.secondary,
          COLORS.success,
          COLORS.warning,
          COLORS.pink,
        ],
      },
    ],
  };

  const ordersVsRevenueData = {
    labels: ['Performance'],
    datasets: [
      {
        label: 'Orders',
        data: [6],
        backgroundColor: COLORS.warning,
      },
      {
        label: 'Revenue',
        data: [6294],
        backgroundColor: COLORS.purple,
      },
    ],
  };

  const orderStatusData = {
    labels: ['Pending','Approved','Delivered','Cancelled'],
    datasets: [
      {
        data: [1,2,2,1],
        backgroundColor: [
          COLORS.warning,
          COLORS.primary,
          COLORS.success,
          COLORS.danger,
        ],
      },
    ],
  };

  const sellerColors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.success,
    COLORS.warning,
  ];

  const sellerRevenueData = {
    labels: ['Tech Hub','Fashion Store','Electro Mart','Green Mart'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [2500,1800,1200,794],
        backgroundColor: sellerColors,
      },
    ],
  };

  const sellerOrdersData = {
    labels: ['Tech Hub','Fashion Store','Electro Mart','Green Mart'],
    datasets: [
      {
        label: 'Orders',
        data: [2,2,1,1],
        backgroundColor: sellerColors,
      },
    ],
  };

  return (
    <div className="analytics">
      <h1>Analytics Dashboard</h1>

      <div className="section chart-container">
        <h2>📈Sales Overview</h2>
        <div className="chart-box large">
          <Line data={salesData} options={commonOptions} />
        </div>
      </div>

      <div className="section chart-container">
        <h2>Product Views</h2>
        <div className="chart-box large">
          <Bar data={viewsData} options={commonOptions} />
        </div>
      </div>

      <div className="section chart-container">
        <h2>Top Selling Products</h2>
        <div className="chart-box large">
          <Bar
            data={topProductsData}
            options={{ ...commonOptions, indexAxis: 'y' }}
          />
        </div>
      </div>

      <div className="section chart-container">
        <h2>📦Orders vs ₹ Revenue</h2>
        <div className="chart-box large">
          <Bar data={ordersVsRevenueData} options={commonOptions} />
        </div>
      </div>

      <div className="section chart-container">
        <h2>🟢Order Status</h2>
        <div className="chart-box small">
          <Doughnut data={orderStatusData} options={doughnutOptions} />
        </div>
      </div>

      <div className="section chart-container">
        <h2>🏪Seller-wise Revenue</h2>
        <div className="chart-box large">
          <Bar data={sellerRevenueData} options={commonOptions} />
        </div>
      </div>

      <div className="section chart-container">
        <h2>📦Seller-wise Orders</h2>
        <div className="chart-box large">
          <Bar data={sellerOrdersData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
