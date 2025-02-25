import React from 'react';
import '../styles/ProgressTracker.css';


function ProgressTracker({ habits }) {
  const safeHabits = Array.isArray(habits) ? habits : [];

  return (
    <div className="progress-tracker">
      <h2>Progress</h2>
      {safeHabits.length > 0 ? (
        <ul>
          {safeHabits.map(habit => (
            <li key={habit.id}>
              {habit.name}: {habit.streak} days
            </li>
          ))}
        </ul>
      ) : (
        <p>No progress to show</p>
      )}
    </div>
  );
}

export default ProgressTracker;
