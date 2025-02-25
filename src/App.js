// src/App.js
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Add Firebase auth imports
import { auth } from './firebase'; // Import auth from firebase.js
import DashboardPage from './components/DashboardPage';
import HabitsPage from './components/HabitsPage';
import InsightsPage from './components/InsightsPage';
import LoginPage from './components/LoginPage'; // Import LoginPage
import './styles/App.css';

export const HabitsContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => 
    localStorage.getItem('darkMode') === 'true'
  );
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits_v2');
    const parsed = saved ? JSON.parse(saved) : [];
    const today = new Date().toISOString().split('T')[0];
    return parsed.map(habit => ({
      ...habit,
      completedToday: habit.history[habit.history.length - 1] === today,
    }));
  });
  const [user, setUser] = useState(null); // Add user state for authentication

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkDayReset = () => {
      const today = new Date().toISOString().split('T')[0];
      setHabits(prev => {
        const updatedHabits = prev.map(habit => {
          const lastCompleted = habit.history[habit.history.length - 1];
          const isSameDay = lastCompleted === today;
          const missedDay = !isSameDay && lastCompleted && new Date(lastCompleted) < new Date(today).setDate(new Date(today).getDate() - 1);
          return {
            ...habit,
            completedToday: isSameDay,
            streak: missedDay ? 0 : habit.streak,
          };
        });
        localStorage.setItem('habits_v2', JSON.stringify(updatedHabits));
        return updatedHabits;
      });
    };

    checkDayReset();
    const interval = setInterval(checkDayReset, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const addHabit = useCallback((name, category = 'General') => {
    setHabits(prev => [
      ...prev,
      {
        id: Date.now(),
        name,
        category,
        streak: 0,
        completedToday: false,
        priority: false,
        history: [],
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const toggleHabitCompletion = useCallback((id) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      const today = new Date().toISOString().split('T')[0];
      const wasCompletedToday = habit.completedToday && habit.history[habit.history.length - 1] === today;
      const newStreak = wasCompletedToday ? habit.streak - 1 : habit.streak + 1;
      return {
        ...habit,
        completedToday: !wasCompletedToday,
        streak: Math.max(0, newStreak),
        history: wasCompletedToday 
          ? habit.history.slice(0, -1) 
          : [...habit.history, today],
      };
    }));
  }, []);

  const editHabit = useCallback((id, updates) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  }, []);

  const deleteHabit = useCallback((id) => {
    const habitToDelete = habits.find(h => h.id === id);
    setHabits(prev => prev.filter(habit => habit.id !== id));
    return habitToDelete; 
  }, [habits]);

  const togglePriority = useCallback((id) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, priority: !habit.priority } : habit
    ));
  }, []);

  const contextValue = {
    habits,
    addHabit,
    toggleHabitCompletion,
    editHabit,
    deleteHabit,
    togglePriority,
  };

  return (
    <Router>
      <HabitsContext.Provider value={contextValue}>
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
          {user ? (
            <>
              <nav className="app-nav">
                <NavLink to="/" className="nav-link" activeClassName="active">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 2L21 9V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V9Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Dashboard
                </NavLink>
                <NavLink to="/habits" className="nav-link" activeClassName="active">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M3 6H21M3 10H21M3 14H21M3 18H21" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Habits
                </NavLink>
                <NavLink to="/insights" className="nav-link" activeClassName="active">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17V21H7L18 10L14 6L3 17ZM14 2L18 6L21 3L17 0L14 2Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Insights
                </NavLink>
                <button className="mode-toggle" onClick={toggleDarkMode}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    {isDarkMode ? (
                      <path d="M12 3V5M12 19V21M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M3 12H5M19 12H21M5.64 18.36L4.22 19.78M19.78 5.64L18.36 4.22" stroke="currentColor" strokeWidth="2" />
                    ) : (
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" />
                    )}
                  </svg>
                </button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </nav>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/habits" element={<HabitsPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </div>
      </HabitsContext.Provider>
    </Router>
  );
}

export default App;