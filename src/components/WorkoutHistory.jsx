import { useState } from 'react';
import WorkoutCard from './WorkoutCard';

function WorkoutHistory({ workouts = [], onEditWorkout, onDeleteWorkout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const getTimeOfDayOrder = (timeOfDay) => {
    if (timeOfDay === 'AM') return 1;
    if (timeOfDay === 'Noon') return 2;
    if (timeOfDay === 'PM') return 3;
    return 0;
  };

  const getLocalDateValue = (dateString) => {
    if (!dateString) return 0;
    return new Date(`${dateString}T00:00:00`).getTime();
  };

  const filteredWorkouts = [...workouts]
    .filter((workout) => {
      const search = searchTerm.toLowerCase();

      const notesText = (workout.notes || '').toLowerCase();
      const locationText = (workout.location || '').toLowerCase();
      const typeText = (workout.type || '').toLowerCase();
      const strengthTypeText = (workout.strengthType || '').toLowerCase();
      const strengthNotesText = (workout.strengthNotes || '').toLowerCase();

      const matchesSearch =
        notesText.includes(search) ||
        locationText.includes(search) ||
        typeText.includes(search) ||
        strengthTypeText.includes(search) ||
        strengthNotesText.includes(search);

      const matchesType =
        filterType === 'All' ||
        workout.type === filterType ||
        (filterType === 'Strength Completed' && workout.didStrength === 'Yes');

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        const dateDiff = getLocalDateValue(b.date) - getLocalDateValue(a.date);
        if (dateDiff !== 0) return dateDiff;
        return getTimeOfDayOrder(b.timeOfDay) - getTimeOfDayOrder(a.timeOfDay);
      }

      if (sortBy === 'oldest') {
        const dateDiff = getLocalDateValue(a.date) - getLocalDateValue(b.date);
        if (dateDiff !== 0) return dateDiff;
        return getTimeOfDayOrder(a.timeOfDay) - getTimeOfDayOrder(b.timeOfDay);
      }

      if (sortBy === 'distanceHigh') {
        return Number(b.distance || 0) - Number(a.distance || 0);
      }

      if (sortBy === 'distanceLow') {
        return Number(a.distance || 0) - Number(b.distance || 0);
      }

      return 0;
    });

  return (
    <section className="card panel history-panel">
      <div className="toolbar">
        <div>
          <h2>Workout History</h2>
          <p className="panel-intro">
            Review, search, filter, and manage your saved entries.
          </p>
        </div>
      </div>

      <div className="toolbar-controls">
        <input
          type="text"
          placeholder="Search notes or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Workouts</option>
          <option value="Easy Run">Easy Run</option>
          <option value="Long Run">Long Run</option>
          <option value="Threshold">Threshold</option>
          <option value="Intervals">Intervals</option>
          <option value="Recovery Run">Recovery Run</option>
          <option value="Strength Completed">Strength Completed</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Sort by newest</option>
          <option value="oldest">Sort by oldest</option>
          <option value="distanceHigh">Distance high to low</option>
          <option value="distanceLow">Distance low to high</option>
        </select>
      </div>

      <div className="workout-list" aria-live="polite">
        {filteredWorkouts.length === 0 ? (
          <div className="empty-state">
            <h3>No workouts found</h3>
            <p>Try changing your search or filter.</p>
          </div>
        ) : (
          filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onEditWorkout={onEditWorkout}
              onDeleteWorkout={onDeleteWorkout}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default WorkoutHistory;