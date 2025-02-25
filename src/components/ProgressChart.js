import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ProgressChart({ habits }) {
  const data = {
    labels: habits.map(h => h.name),
    datasets: [
      {
        label: 'Habit Streaks',
        data: habits.map(h => h.streak),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Habit Progress'
      }
    }
  };

  return (
    <div className="progress-chart">
      <Line data={data} options={options} />
    </div>
  );
}

export default ProgressChart;
