import React, { useContext, useState } from 'react';
import { HabitsContext } from '../App';
import HabitList from './HabitList';
import '../styles/HabitsPage.css';

function HabitsPage() {
  const { habits, addHabit, toggleHabitCompletion, editHabit, deleteHabit, togglePriority } = useContext(HabitsContext);
  const [lastDeleted, setLastDeleted] = useState(null);

  const handleDelete = (id) => {
    const deleted = deleteHabit(id);
    setLastDeleted(deleted);
    setTimeout(() => setLastDeleted(null), 5000);
  };

  const undoDelete = () => {
    if (lastDeleted) {
      addHabit(lastDeleted.name, lastDeleted.category);
      setLastDeleted(null);
    }
  };

  return (
    <div className="habits-page">
      <header className="habits-header">
        <h1>Habits</h1>
        <p className="habits-subtitle">Build your daily rhythm</p>
      </header>
      <HabitList
        habits={habits}
        addHabit={addHabit}
        toggleHabitCompletion={toggleHabitCompletion}
        editHabit={editHabit}
        deleteHabit={handleDelete}
        togglePriority={togglePriority}
      />
      {lastDeleted && (
        <div className="undo-bar">
          <p>Deleted "{lastDeleted.name}"</p>
          <button onClick={undoDelete} className="undo-btn">Undo</button>
        </div>
      )}
    </div>
  );
}

export default HabitsPage;
