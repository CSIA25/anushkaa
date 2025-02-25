import React, { useState, useRef, useEffect } from 'react';
import '../styles/HabitList.css';

function HabitList({ habits, addHabit, toggleHabitCompletion, editHabit, deleteHabit, togglePriority }) {
  const [newHabit, setNewHabit] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [historyId, setHistoryId] = useState(null);
  const inputRef = useRef(null);

  const categories = ['General', 'Fitness', 'Learning', 'Work', 'Health'];

  const handleAdd = (e) => {
    e.preventDefault();
    if (newHabit.trim()) {
      addHabit(newHabit, newCategory);
      setNewHabit('');
      inputRef.current?.focus();
    }
  };

  const startEditing = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };

  const saveEdit = (id) => {
    if (editValue.trim()) {
      editHabit(id, { name: editValue });
    }
    setEditingId(null);
  };

  const toggleHistory = (id) => {
    setHistoryId(historyId === id ? null : id);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const groupedHabits = categories.reduce((acc, cat) => {
    acc[cat] = habits.filter(h => h.category === cat);
    return acc;
  }, {});

  return (
    <section className="habit-list">
      <form onSubmit={handleAdd} className="habit-form">
        <input
          ref={inputRef}
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a habit (e.g., Read 20 pages)"
          className="habit-input"
          aria-label="New habit"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="category-select"
          aria-label="Habit category"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className="add-btn" aria-label="Add habit">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" />
          </svg>
        </button>
      </form>
      <div className="habits-container">
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>Build your habits, shape your future</p>
          </div>
        ) : (
          categories.map(cat => groupedHabits[cat].length > 0 && (
            <div key={cat} className="category-group">
              <h3 className="category-title">{cat}</h3>
              {groupedHabits[cat].map(habit => (
                <div key={habit.id} className="habit-item">
                  {editingId === habit.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="edit-input"
                      autoFocus
                      onBlur={() => saveEdit(habit.id)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(habit.id)}
                    />
                  ) : (
                    <>
                      <div className="habit-info">
                        <span className="habit-name">{habit.name}</span>
                        <span className="habit-streak">
                          {habit.streak} days
                        </span>
                      </div>
                      <div className="habit-controls">
                        <button
                          onClick={() => toggleHabitCompletion(habit.id)}
                          className={`complete-btn ${habit.completedToday ? 'completed' : ''}`}
                          aria-label={`Mark ${habit.name} as ${habit.completedToday ? 'incomplete' : 'complete'}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => togglePriority(habit.id)}
                          className={`priority-btn ${habit.priority ? 'high' : ''}`}
                          aria-label={`Set ${habit.name} as ${habit.priority ? 'normal' : 'high'} priority`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 22H22L12 2Z" stroke={habit.priority ? '#f1c40f' : '#666'} strokeWidth="2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => startEditing(habit.id, habit.name)}
                          className="edit-btn"
                          aria-label={`Edit ${habit.name}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4V20H20V9M18 4L11 11V13H13L20 6" stroke="#666" strokeWidth="2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleHistory(habit.id)}
                          className="history-btn"
                          aria-label={`View ${habit.name} history`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 8V12L15 15M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z" stroke="#666" strokeWidth="2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="delete-btn"
                          aria-label={`Delete ${habit.name}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M6 6L18 18M6 18L18 6" stroke="white" strokeWidth="2" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                  {historyId === habit.id && (
                    <div className="history-popup">
                      <h4>Completion History</h4>
                      {habit.history.length > 0 ? (
                        <ul>
                          {habit.history.slice(-5).reverse().map((date, idx) => (
                            <li key={idx}>{date}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No completions yet</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default HabitList;
