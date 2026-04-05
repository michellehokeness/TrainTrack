function WorkoutCard({ workout, onEditWorkout, onDeleteWorkout }) {
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'No date';

    return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (totalMinutes) => {
    const total = Number(totalMinutes || 0);
    const hours = Math.floor(total / 60);
    const minutes = total % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (hours > 0) {
      return `${hours}h`;
    }

    return `${minutes}m`;
  };

  return (
    <article className="workout-card">
      <div className="workout-top">
        <div>
          <h3 className="workout-title">{workout.type}</h3>
          <p className="workout-date">
            {formatDisplayDate(workout.date)}
            {workout.timeOfDay && <> · {workout.timeOfDay}</>}
            {workout.location && (
              <>
                {' '}·{' '}
                <span className="location-badge">{workout.location}</span>
              </>
            )}
          </p>
        </div>

        {workout.effort && <span className="badge">{workout.effort}</span>}
      </div>

      <div className="meta-grid">
        {!workout.isStrengthOnly && (
          <>
            <div className="meta-box">
              <div className="meta-label">Distance</div>
              <div className="meta-value">{workout.distance.toFixed(1)} mi</div>
            </div>

            <div className="meta-box">
              <div className="meta-label">Duration</div>
              <div className="meta-value">{formatDuration(workout.duration)}</div>
            </div>

            <div className="meta-box">
              <div className="meta-label">Effort</div>
              <div className="meta-value">{workout.effort}</div>
            </div>
          </>
        )}

        <div className={`meta-box ${workout.didStrength === 'Yes' ? 'strength-box' : ''}`}>
          <div className="meta-label">Strength</div>
          <div className="meta-value">
            {workout.didStrength === 'Yes'
              ? workout.strengthType || 'Completed'
              : 'No'}
          </div>
        </div>
      </div>

      {!workout.isStrengthOnly && (
        <p className="notes">
          {workout.notes || 'No notes added for this workout.'}
        </p>
      )}

      {workout.didStrength === 'Yes' && workout.strengthNotes && (
        <p className="notes">
          <strong>Strength Notes:</strong> {workout.strengthNotes}
        </p>
      )}

      <div className="workout-actions">
        <button
          type="button"
          className="btn-edit"
          onClick={() => onEditWorkout(workout)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn-delete"
          onClick={() => onDeleteWorkout(workout.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default WorkoutCard;