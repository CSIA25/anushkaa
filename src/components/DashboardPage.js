import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { HabitsContext } from '../App';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import '../styles/DashboardPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

function DashboardPage() {
  const { habits } = useContext(HabitsContext);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  const todayCompleted = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);
  const quotes = [
    "The best way to predict the future is to create it.",
    "Small steps every day lead to big results.",
    "Consistency is the key to mastery.",
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  
  const topStreaks = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 5);

  
  const priorityHabits = habits.filter(h => h.priority);

  
  const categories = ['General', 'Fitness', 'Learning', 'Work', 'Health'];
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = habits.filter(h => h.category === cat).length;
    return acc;
  }, {});

  
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const { latitude, longitude } = position.coords;
        const apiKey = '69e1ae153fd99cd188ffa9412b399803'; 
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        setWeatherError('Couldn’t fetch weather—using default.');
        setWeather({ weather: [{ main: 'Clear' }], main: { temp: 20 } }); 
      }
    };
    fetchWeather();
  }, []);

  const weatherSuggestions = {
    Clear: 'Perfect day for a walk—stretch those legs!',
    Clouds: 'Cloudy vibes? Try some indoor reading.',
    Rain: 'Rainy day—ideal for a cozy meditation session.',
    Snow: 'Snowy out there—warm up with some yoga.',
  };
  const weatherMood = weather ? weatherSuggestions[weather.weather[0].main] || 'Keep crushing it!' : 'Loading weather...';

  
  const trendData = {
    labels: calendarDays.slice(-7).map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [{
      label: 'Daily Completions',
      data: calendarDays.slice(-7).map(date => habits.filter(h => h.history.includes(date)).length),
      borderColor: '#4a90e2',
      backgroundColor: 'rgba(74, 144, 226, 0.2)',
      tension: 0.3,
      fill: true,
      pointRadius: 4,
    }],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Last 7 Days', font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Completions' } },
      x: { grid: { display: false } },
    },
  };

  
  const milestones = [
    { days: 5, label: 'Solid Start' },
    { days: 10, label: 'Habit Hero' },
    { days: 20, label: 'Mastery Milestone' },
  ];
  const achievedMilestones = milestones.filter(m => habits.some(h => h.streak >= m.days));

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>HabitSphere</h1>
        <p className="dashboard-quote">"{quote}"</p>
      </header>
      <section className="dashboard-content">
        {}
        <div className="dashboard-card habit-calendar">
          <h2>Habit Calendar (30 Days)</h2>
          <div className="calendar-grid">
            {calendarDays.map(day => {
              const completed = habits.some(h => h.history.includes(day));
              return (
                <div key={day} className="calendar-day">
                  <span className="day-label">{new Date(day).getDate()}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill={completed ? '#27ae60' : '#e8ecef'}>
                    <circle cx="8" cy="8" r="6" />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>

        {}
        <div className="dashboard-card progress-circle">
          <h2>Today’s Progress</h2>
          <div className="circle-container">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e8ecef" strokeWidth="20" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#4a90e2"
                strokeWidth="20"
                strokeDasharray="565.48"
                strokeDashoffset={565.48 * (1 - (totalHabits ? todayCompleted / totalHabits : 0))}
                transform="rotate(-90 100 100)"
              />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="36" fill="#2c344b">
                {todayCompleted}/{totalHabits}
              </text>
            </svg>
            <p className="progress-text">
              {totalHabits ? Math.round((todayCompleted / totalHabits) * 100) : 0}% Complete
            </p>
          </div>
        </div>

        {}
        <div className="dashboard-card priority-spotlight">
          <h2>Priority Spotlight</h2>
          {priorityHabits.length > 0 ? (
            <ul>
              {priorityHabits.map(habit => (
                <li key={habit.id} className="priority-item">
                  <span className="priority-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 22H22L12 2Z" stroke="#f1c40f" strokeWidth="2" />
                    </svg>
                  </span>
                  <span className="priority-name">{habit.name}</span>
                  <span className="priority-status">
                    {habit.completedToday ? 'Done' : 'Pending'} - {habit.streak} days
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">No priority habits yet—mark some with the triangle!</p>
          )}
        </div>

        {}
        <div className="dashboard-card streak-leaderboard">
          <h2>Streak Leaders</h2>
          {topStreaks.length > 0 ? (
            <ul>
              {topStreaks.map((habit, index) => (
                <li key={habit.id} className="streak-item">
                  <span className="streak-rank">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={index === 0 ? '#f1c40f' : index === 1 ? '#95a5a6' : '#d35400'}>
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </span>
                  <span className="streak-name">{habit.name}</span>
                  <span className="streak-value">{habit.streak} days</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">No streaks yet—keep going!</p>
          )}
        </div>

        {}
        <div className="dashboard-card weather-mood">
          <h2>Weather Mood</h2>
          {weather ? (
            <div className="weather-details">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                {weather.weather[0].main === 'Clear' && <path d="M12 3V5M12 19V21M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M3 12H5M19 12H21M5.64 18.36L4.22 19.78M19.78 5.64L18.36 4.22" stroke="#f1c40f" strokeWidth="2" />}
                {weather.weather[0].main === 'Clouds' && <path d="M18 10H16C16 7.79 14.21 6 12 6C9.79 6 8 7.79 8 10H6C4.34 10 3 11.34 3 13C3 14.66 4.34 16 6 16H18C19.66 16 21 14.66 21 13C21 11.34 19.66 10 18 10Z" stroke="#748297" strokeWidth="2" />}
                {weather.weather[0].main === 'Rain' && <path d="M18 10H16C16 7.79 14.21 6 12 6C9.79 6 8 7.79 8 10H6C4.34 10 3 11.34 3 13C3 14.66 4.34 16 6 16H18C19.66 16 21 14.66 21 13C21 11.34 19.66 10 18 10ZM7 18L5 20M11 18L9 20M15 18L13 20M19 18L17 20" stroke="#4a90e2" strokeWidth="2" />}
                {(weather.weather[0].main === 'Snow' || !weather.weather[0].main) && <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#95a5a6" strokeWidth="2" />}
              </svg>
              <div>
                <p className="weather-condition">{weather.weather[0].main} - {weather.main.temp}°C</p>
                <p className="weather-suggestion">{weatherMood}</p>
              </div>
            </div>
          ) : (
            <p className="empty-text">{weatherError || 'Loading weather...'}</p>
          )}
        </div>

        {}
        <div className="dashboard-card category-breakdown">
          <h2>Category Breakdown</h2>
          {habits.length > 0 ? (
            <ul>
              {categories.map(cat => categoryCounts[cat] > 0 && (
                <li key={cat} className="category-item">
                  <span className="category-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 22H22L12 2Z" stroke="#4a90e2" strokeWidth="2" />
                    </svg>
                  </span>
                  <span className="category-name">{cat}</span>
                  <span className="category-count">{categoryCounts[cat]} habits</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">No habits yet—start categorizing!</p>
          )}
        </div>

        {}
        <div className="dashboard-card completion-trend">
          <h2>Completion Trend</h2>
          <div className="trend-chart">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>

        {}
        <div className="dashboard-card milestones">
          <h2>Milestones Achieved</h2>
          {achievedMilestones.length > 0 ? (
            <ul>
              {achievedMilestones.map(m => (
                <li key={m.days} className="milestone-item">
                  <span className="milestone-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#27ae60">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </span>
                  <span className="milestone-label">{m.label}</span>
                  <span className="milestone-days">{m.days} days</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">No milestones yet—aim for 5 days!</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
