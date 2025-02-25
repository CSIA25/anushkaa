import React, { useContext, useMemo } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { HabitsContext } from '../App';
import '../styles/InsightsPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function InsightsPage() {
  const { habits } = useContext(HabitsContext);

  
  const weeklyData = useMemo(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    const data = dates.map(date => habits.filter(h => h.history.includes(date)).length);
    return {
      labels: dates.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [{
        label: 'Habits Completed',
        data,
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      }],
    };
  }, [habits]);

  const weeklyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weekly Completions', font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Completions' } },
    },
  };

  
  const streakData = useMemo(() => {
    const streakCounts = [0, 1, 5, 10, 20, 30].map(range => ({
      range,
      count: habits.filter(h => h.streak >= range && h.streak < (range === 30 ? Infinity : range + 5)).length,
    }));
    return {
      labels: streakCounts.map(s => `${s.range}+`),
      datasets: [{
        label: 'Habits by Streak',
        data: streakCounts.map(s => s.count),
        backgroundColor: '#4a90e2',
        borderColor: '#357abd',
        borderWidth: 1,
      }],
    };
  }, [habits]);

  const streakOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Streak Distribution', font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Habits' } },
      x: { title: { display: true, text: 'Streak Length (days)' } },
    },
  };

  
  const categoryData = useMemo(() => {
    const categories = ['General', 'Fitness', 'Learning', 'Work', 'Health'];
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    const counts = categories.map(cat => 
      habits
        .filter(h => h.category === cat)
        .reduce((sum, h) => sum + h.history.filter(d => dates.includes(d)).length, 0)
    );
    return {
      labels: categories,
      datasets: [{
        data: counts,
        backgroundColor: ['#4a90e2', '#27ae60', '#f1c40f', '#e74c3c', '#9b59b6'],
        borderColor: '#fff',
        borderWidth: 2,
      }],
    };
  }, [habits]);

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Category Performance (Last 7 Days)', font: { size: 18 } },
    },
  };

  
  const consistencyScore = useMemo(() => {
    if (!habits.length) return 0;
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    const totalPossible = habits.length * 7;
    const totalCompleted = habits.reduce((sum, h) => 
      sum + h.history.filter(d => dates.includes(d)).length, 0
    );
    return Math.round((totalCompleted / totalPossible) * 100);
  }, [habits]);

  
  const longestStreakHabit = useMemo(() => 
    habits.reduce((max, h) => h.streak > max.streak ? h : max, { streak: 0, name: 'None' })
  , [habits]);

  return (
    <div className="insights-page">
      <header className="insights-header">
        <h1>Insights</h1>
        <p className="insights-subtitle">Unlock your habit potential</p>
      </header>
      <section className="insights-content">
        {habits.length > 0 ? (
          <div className="insights-grid">
            {}
            <div className="insights-card weekly-completions">
              <Line data={weeklyData} options={weeklyOptions} />
            </div>

            {}
            <div className="insights-card streak-distribution">
              <Bar data={streakData} options={streakOptions} />
            </div>

            {}
            <div className="insights-card category-performance">
              <Pie data={categoryData} options={categoryOptions} />
            </div>

            {}
            <div className="insights-card consistency-score">
              <h2>Consistency Score</h2>
              <div className="score-container">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="65" fill="none" stroke="#e8ecef" strokeWidth="15" />
                  <circle
                    cx="75"
                    cy="75"
                    r="65"
                    fill="none"
                    stroke="#27ae60"
                    strokeWidth="15"
                    strokeDasharray="408.4"
                    strokeDashoffset={408.4 * (1 - consistencyScore / 100)}
                    transform="rotate(-90 75 75)"
                  />
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="36" fill="#2c344b">
                    {consistencyScore}%
                  </text>
                </svg>
                <p className="score-text">Your 7-day consistency</p>
              </div>
            </div>

            {}
            <div className="insights-card longest-streak">
              <h2>Longest Streak</h2>
              <div className="streak-details">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#f1c40f">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <div>
                  <p className="streak-habit-name">{longestStreakHabit.name}</p>
                  <p className="streak-habit-value">{longestStreakHabit.streak} days</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Add habits to see your insights here</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default InsightsPage;
